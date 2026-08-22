import json
from typing import List, Optional, Any
from pathlib import Path

from ai.services.ai_client import AIService
from ai.services.retrieval_service import RetrievalService, RetrievedChunk
from ai.schemas.extraction import CanonicalMedicalExtraction
from ai.schemas.events import Timeline
from ai.schemas.qa import QAResponse
from ai.schemas.evidence import EvidenceSchema
from ai.services.conflict_service import ConflictService

class QAService:
    """
    Record-Grounded Q&A Engine ("Ask My Records").
    Answers doctor queries strictly from patient's documented medical history.
    """

    def __init__(self, ai_service: Optional[AIService] = None, retrieval_service: Optional[RetrievalService] = None):
        self.ai_service = ai_service or AIService()
        self.retrieval_service = retrieval_service or RetrievalService()
        self.conflict_service = ConflictService()
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = Path(__file__).parent.parent / "prompts" / "qa.txt"
        if prompt_path.exists():
            return prompt_path.read_text()
        return "Answer query based on records:\nContext: {{PATIENT_CONTEXT}}\nQuestion: {{DOCTOR_QUESTION}}"

    def answer_question(
        self,
        patient_id: str,
        question: str,
        extractions: List[CanonicalMedicalExtraction],
        timeline: Optional[Timeline] = None
    ) -> QAResponse:
        """
        Answers a doctor question for a given patient.
        Ensures strict patient scoping, grounding, and evidence attachment.
        """
        if not patient_id:
            raise ValueError("patient_id is required for Ask My Records Q&A.")

        # Out of scope advice check
        question_lower = question.lower()
        advice_triggers = ["should i increase", "should i stop", "what treatment do you recommend", "how to treat"]
        for trigger in advice_triggers:
            if trigger in question_lower:
                med_chunks = self.retrieval_service.retrieve(patient_id, "medication", extractions, timeline)
                evidences = [c.evidence for c in med_chunks if c.evidence]
                return QAResponse(
                    answer="The available records can be used to summarize the patient's documented medication history, but this system does not provide treatment or dosage recommendations.",
                    status="answered",
                    confidence="high",
                    evidence=evidences
                )

        # Check for clinical conflicts across records
        conflicts = self.conflict_service.detect_conflicts(extractions)

        # Retrieve relevant chunks for this patient
        chunks = self.retrieval_service.retrieve(patient_id, question, extractions, timeline)

        if not chunks:
            # Check if query matches common record types that don't exist
            return QAResponse(
                answer=f"I could not find information regarding '{question}' in the patient's available medical records.",
                status="not_found",
                confidence="high",
                evidence=[]
            )

        # Construct patient context
        context_str = "\n".join([f"- [{c.record_type.upper()}] {c.content}" for c in chunks])

        prompt = self.prompt_template.replace("{{PATIENT_CONTEXT}}", context_str[:4000])
        prompt = prompt.replace("{{DOCTOR_QUESTION}}", question)

        try:
            result_json = self.ai_service.complete_json(prompt)
            qa_res = QAResponse.model_validate(result_json)
        except Exception:
            qa_res = self._fallback_qa(question, chunks, conflicts)

        # Verify evidence references
        if not qa_res.evidence and qa_res.status != "not_found":
            qa_res.evidence = [c.evidence for c in chunks if c.evidence]
        elif qa_res.status == "not_found":
            qa_res.evidence = []

        return qa_res

    def _fallback_qa(
        self,
        question: str,
        chunks: List[RetrievedChunk],
        conflicts: List[Any]
    ) -> QAResponse:
        """Deterministic fallback answer generator."""
        q_lower = question.lower()

        # Check conflict match
        if conflicts and ("medication" in q_lower or "metformin" in q_lower or "dosage" in q_lower):
            c = conflicts[0]
            sources = [s for s in c.sources if s]
            return QAResponse(
                answer=f"The available records contain conflicting information: {c.explanation}",
                status="conflict",
                confidence="high",
                evidence=sources
            )

        # Specific topic verification (e.g. blood group, allergies when missing)
        if "blood group" in q_lower or "blood type" in q_lower:
            has_group = any("blood group" in c.content.lower() or "blood type" in c.content.lower() for c in chunks)
            if not has_group:
                return QAResponse(
                    answer="I could not find the patient's blood group in the available medical records.",
                    status="not_found",
                    confidence="high",
                    evidence=[]
                )

        contents = [c.content for c in chunks]
        evidences = [c.evidence for c in chunks if c.evidence]

        return QAResponse(
            answer=f"Based on the patient's records: {'; '.join(contents)}",
            status="answered",
            confidence="high",
            evidence=evidences
        )

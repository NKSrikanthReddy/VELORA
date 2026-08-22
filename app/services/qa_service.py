import re
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.schemas.chat import QAResponse, ChatEvidenceResponse

class BaseQuestionAnswerService(ABC):
    @abstractmethod
    def answer_question(self, question: str, patient_records: Dict[str, Any]) -> QAResponse:
        """Answer doctor's clinical question strictly using patient's authorized records."""
        pass

class DefaultQuestionAnswerService(BaseQuestionAnswerService):
    SAFETY_TRIGGERS = [
        "should i increase", "should i decrease", "should i stop", "should i start",
        "treatment recommendation", "diagnose", "what dosage should i give",
        "change medication", "prescribe", "predict"
    ]

    def answer_question(self, question: str, patient_records: Dict[str, Any]) -> QAResponse:
        q_lower = question.lower()

        # Check Safety Boundary
        for trigger in self.SAFETY_TRIGGERS:
            if trigger in q_lower:
                return QAResponse(
                    answer="The available records can be used to summarize the patient's documented medical and medication history, but this system does not provide treatment recommendations, dosage changes, or medical predictions.",
                    status="uncertain",
                    evidence=[]
                )

        documents = patient_records.get("documents", [])
        medications = patient_records.get("medications", [])
        labs = patient_records.get("lab_results", [])
        events = patient_records.get("events", [])

        evidence_list: List[ChatEvidenceResponse] = []

        if "medication" in q_lower or "drug" in q_lower or "medicine" in q_lower or "taking" in q_lower or "prescrib" in q_lower:
            if medications:
                med_lines = []
                for m in medications:
                    med_str = f"• {m.get('name')} {m.get('dosage', '')} ({m.get('frequency', '')}) - Status: {m.get('status', 'active')}"
                    med_lines.append(med_str)
                    if m.get("source_document_id"):
                        evidence_list.append(ChatEvidenceResponse(
                            document_id=m.get("source_document_id"),
                            filename=m.get("source_filename", "prescription.pdf"),
                            page_number=m.get("page_number", 1),
                            source_text=m.get("source_text", f"Prescription: {m.get('name')} {m.get('dosage')}"),
                            relevance_score=0.95
                        ))
                
                answer_text = "According to the patient's documented medical records, the following medications are on record:\n" + "\n".join(med_lines)
                return QAResponse(
                    answer=answer_text,
                    status="answered",
                    evidence=evidence_list
                )

        if "lab" in q_lower or "blood" in q_lower or "hba1c" in q_lower or "sugar" in q_lower or "test" in q_lower:
            if labs:
                lab_lines = []
                for l in labs:
                    lab_str = f"• {l.get('test_name')}: {l.get('value')} {l.get('unit', '')} (Ref: {l.get('reference_range', 'N/A')}, Status: {l.get('status')})"
                    lab_lines.append(lab_str)
                    if l.get("source_document_id"):
                        evidence_list.append(ChatEvidenceResponse(
                            document_id=l.get("source_document_id"),
                            filename=l.get("source_filename", "blood_report.pdf"),
                            page_number=l.get("page_number", 1),
                            source_text=l.get("source_text", f"{l.get('test_name')}: {l.get('value')} {l.get('unit')}"),
                            relevance_score=0.92
                        ))

                answer_text = "The documented lab results for this patient show:\n" + "\n".join(lab_lines)
                return QAResponse(
                    answer=answer_text,
                    status="answered",
                    evidence=evidence_list
                )

        if "event" in q_lower or "history" in q_lower or "diagnos" in q_lower or "timeline" in q_lower or "consultation" in q_lower:
            if events:
                ev_lines = []
                for e in events:
                    ev_str = f"• [{e.get('event_date', 'Date N/A')}] {e.get('title')}: {e.get('description', '')}"
                    ev_lines.append(ev_str)
                    if e.get("document_id"):
                        evidence_list.append(ChatEvidenceResponse(
                            document_id=e.get("document_id"),
                            filename=e.get("source_filename", "consultation_report.pdf"),
                            page_number=e.get("page_number", 1),
                            source_text=e.get("source_text", e.get("title")),
                            relevance_score=0.88
                        ))

                answer_text = "The chronological medical history documented for this patient includes:\n" + "\n".join(ev_lines)
                return QAResponse(
                    answer=answer_text,
                    status="answered",
                    evidence=evidence_list
                )

        # Generic record query
        if documents:
            first_doc = documents[0]
            evidence_list.append(ChatEvidenceResponse(
                document_id=first_doc.get("id"),
                filename=first_doc.get("filename"),
                page_number=1,
                source_text=first_doc.get("extracted_text", "")[:200],
                relevance_score=0.75
            ))
            return QAResponse(
                answer=f"The patient's consolidated record contains {len(documents)} uploaded medical documents covering consultations, prescriptions, and lab tests.",
                status="answered",
                evidence=evidence_list
            )

        return QAResponse(
            answer="No relevant medical records or evidence found in this patient's history for the specified query.",
            status="not_found",
            evidence=[]
        )

qa_service: BaseQuestionAnswerService = DefaultQuestionAnswerService()

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from ai.schemas.extraction import CanonicalMedicalExtraction
from ai.schemas.events import Timeline, MedicalEvent
from ai.schemas.evidence import EvidenceSchema

class RetrievedChunk(BaseModel):
    patient_id: str
    record_type: str
    content: str
    evidence: Optional[EvidenceSchema] = None
    score: float = 1.0

class RetrievalService:
    """
    Patient-scoped retrieval service.
    Filters all searches strictly by patient_id to prevent cross-patient data access.
    """

    def retrieve(
        self,
        patient_id: str,
        query: str,
        extractions: List[CanonicalMedicalExtraction],
        timeline: Optional[Timeline] = None,
        max_results: int = 5
    ) -> List[RetrievedChunk]:
        """
        Retrieves relevant medical record chunks scoped exclusively to the given patient_id.
        """
        if not patient_id:
            raise ValueError("patient_id is mandatory for patient-scoped retrieval.")

        STOP_WORDS = {
            "what", "which", "when", "where", "who", "whom", "this", "that", "these", "those",
            "is", "was", "are", "were", "been", "being", "have", "has", "had", "does", "did",
            "the", "a", "an", "and", "or", "but", "patient", "patients", "patient's", "doc", "doctor",
            "tell", "me", "about", "show", "get", "list", "find", "for"
        }
        import re
        raw_tokens = [re.sub(r"[^\w]", "", t.lower()) for t in query.split()]
        query_tokens = [t for t in raw_tokens if len(t) > 1 and t not in STOP_WORDS]
        chunks: List[RetrievedChunk] = []

        # Index canonical extractions
        for ext in extractions:
            for d in ext.diagnoses:
                text_content = f"Diagnosis: {d.text} (Status: {d.status or 'documented'})"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="diagnosis",
                        content=text_content,
                        evidence=d.evidence,
                        score=score
                    ))

            for m in ext.medications:
                text_content = f"Medication: {m.name} Dosage: {m.dosage or 'Unspecified'} Frequency: {m.frequency or 'Unspecified'}"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="medication",
                        content=text_content,
                        evidence=m.evidence,
                        score=score
                    ))

            for l in ext.lab_results:
                text_content = f"Lab Result: {l.test_name} Value: {l.value} {l.unit or ''} Ref: {l.reference_range or ''}"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="lab_result",
                        content=text_content,
                        evidence=l.evidence,
                        score=score
                    ))

            for p in ext.procedures:
                text_content = f"Procedure: {p.name} Date: {p.date or 'Unspecified'}"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="procedure",
                        content=text_content,
                        evidence=p.evidence,
                        score=score
                    ))

            for v in ext.vitals:
                text_content = f"Vital Sign: {v.name} Value: {v.value} {v.unit or ''}"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="vital",
                        content=text_content,
                        evidence=v.evidence,
                        score=score
                    ))

        # Index timeline events
        if timeline:
            for ev in timeline.events:
                if ev.patient_id and ev.patient_id != patient_id:
                    continue  # Guarantee patient isolation
                text_content = f"Event: {ev.title} Date: {ev.event_date or 'Unknown'} Description: {ev.description}"
                score = self._compute_relevance(query_tokens, text_content)
                if score > 0:
                    chunks.append(RetrievedChunk(
                        patient_id=patient_id,
                        record_type="timeline_event",
                        content=text_content,
                        evidence=EvidenceSchema(
                            document_id=ev.document_id,
                            filename=ev.filename,
                            page_number=ev.page_number,
                            source_text=ev.source_text
                        ),
                        score=score
                    ))

        # Sort chunks by relevance score descending
        chunks.sort(key=lambda c: c.score, reverse=True)
        return chunks[:max_results]

    def _compute_relevance(self, query_tokens: List[str], text: str) -> float:
        """Computes keyword match score supporting stemming and plural matching."""
        import re
        text_lower = text.lower()
        if not query_tokens:
            return 1.0
        
        matches = 0.0
        for token in query_tokens:
            clean_token = re.sub(r"[^\w]", "", token)
            if not clean_token:
                continue
            stemmed = clean_token.rstrip("s")
            if clean_token in text_lower or (len(stemmed) >= 3 and stemmed in text_lower):
                matches += 1.0
        return matches

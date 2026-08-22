"""
High-Level Integration Interface for Member 3 (FastAPI/Database Backend) and Member 1 (Frontend).
"""

from typing import List, Dict, Any, Union, Optional
from pathlib import Path

from ai.services.pdf_extractor import PDFExtractor
from ai.services.ocr_service import OCRService
from ai.services.document_classifier import DocumentClassifier
from ai.services.medical_extractor import MedicalExtractor
from ai.services.normalization_service import NormalizationService
from ai.services.event_service import EventService
from ai.services.conflict_service import ConflictService
from ai.services.summary_service import SummaryService
from ai.services.retrieval_service import RetrievalService
from ai.services.qa_service import QAService
from ai.schemas.extraction import CanonicalMedicalExtraction

class MedicalAIInterface:
    """
    Unified facade for the AI/ML document intelligence subsystem.
    Exposes clean input/output dictionary contracts for backend API routes.
    """

    def __init__(self):
        self.pdf_extractor = PDFExtractor()
        self.ocr_service = OCRService()
        self.classifier = DocumentClassifier()
        self.medical_extractor = MedicalExtractor()
        self.normalization_service = NormalizationService()
        self.event_service = EventService()
        self.conflict_service = ConflictService()
        self.summary_service = SummaryService()
        self.retrieval_service = RetrievalService()
        self.qa_service = QAService(retrieval_service=self.retrieval_service)

    def extract_document(
        self,
        patient_id: str,
        document_id: str,
        file_source: Union[str, Path, bytes],
        filename: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Complete processing pipeline for a single uploaded document.
        Pipeline: PDF Extraction -> OCR Fallback -> Document Classification -> Structured Medical Extraction.
        """
        # 1. Text Extraction
        if isinstance(file_source, bytes) or (isinstance(file_source, (str, Path)) and str(file_source).lower().endswith(".pdf")):
            raw_pages = self.pdf_extractor.extract(file_source)
        else:
            # Direct Image OCR
            ocr_text = self.ocr_service.extract_from_image(file_source)
            raw_pages = [{"page_number": 1, "text": ocr_text}]

        # 2. OCR Fallback for under-extracted pages
        pages = self.ocr_service.process_document(file_source, raw_pages)

        # 3. Document Classification
        full_text = "\n".join([p["text"] for p in pages])
        classification = self.classifier.classify(full_text)

        # 4. Structured Medical Extraction
        extraction = self.medical_extractor.extract(pages, document_id=document_id, filename=filename)
        extraction.document_type = classification.document_type

        # 5. Normalization
        for diag in extraction.diagnoses:
            norm = self.normalization_service.normalize_diagnosis(diag.text)
            if norm.normalized:
                diag.normalized_text = norm.normalized

        for med in extraction.medications:
            norm = self.normalization_service.normalize_medication(med.name)
            if norm.normalized:
                med.normalized_name = norm.normalized

        return extraction.model_dump()

    def generate_timeline(
        self,
        patient_id: str,
        extractions_dicts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generates a chronological medical timeline across patient records."""
        extractions = [CanonicalMedicalExtraction.model_validate(d) for d in extractions_dicts]
        all_events = []

        for ext in extractions:
            evs = self.event_service.generate_events_from_extraction(
                extraction=ext,
                patient_id=patient_id
            )
            all_events.extend(evs)

        timeline = self.event_service.create_timeline(all_events, patient_id=patient_id)
        return timeline.model_dump()

    def generate_briefing(
        self,
        patient_id: str,
        extractions_dicts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generates an AI medical briefing for a doctor."""
        extractions = [CanonicalMedicalExtraction.model_validate(d) for d in extractions_dicts]
        timeline = None
        if extractions:
            timeline_dict = self.generate_timeline(patient_id, extractions_dicts)
            from ai.schemas.events import Timeline
            timeline = Timeline.model_validate(timeline_dict)

        conflicts = self.conflict_service.detect_conflicts(extractions)
        briefing = self.summary_service.generate_briefing(extractions, timeline, conflicts)
        return briefing.model_dump()

    def answer_question(
        self,
        patient_id: str,
        question: str,
        extractions_dicts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Answers a doctor's question using only the patient's records ("Ask My Records")."""
        extractions = [CanonicalMedicalExtraction.model_validate(d) for d in extractions_dicts]
        timeline = None
        if extractions:
            timeline_dict = self.generate_timeline(patient_id, extractions_dicts)
            from ai.schemas.events import Timeline
            timeline = Timeline.model_validate(timeline_dict)

        qa_res = self.qa_service.answer_question(patient_id, question, extractions, timeline)
        return qa_res.model_dump()

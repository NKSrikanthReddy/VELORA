import os
from typing import List, Dict, Any, Optional
from pathlib import Path
from pydantic import BaseModel, Field

from ai.services.ai_client import AIService

class DocumentClassification(BaseModel):
    document_type: str = Field(description="Category of the medical document")
    confidence: str = Field(description="Confidence level: high, medium, or low")

VALID_DOCUMENT_TYPES = {
    "consultation",
    "prescription",
    "lab_report",
    "diagnostic_report",
    "admission",
    "discharge_summary",
    "follow_up",
    "other",
    "unknown"
}

class DocumentClassifier:
    """
    Classifies medical document text into predefined categories using LLM.
    Ensures safe handling of low confidence or ambiguous text.
    """

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or AIService()
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = Path(__file__).parent.parent / "prompts" / "classification.txt"
        if prompt_path.exists():
            return prompt_path.read_text()
        return "Classify the following medical text: {{DOCUMENT_TEXT}}"

    def classify(self, document_text: str) -> DocumentClassification:
        """
        Classifies medical document text.
        Returns:
            DocumentClassification object.
        """
        if not document_text or len(document_text.strip()) < 10:
            return DocumentClassification(document_type="unknown", confidence="low")

        prompt = self.prompt_template.replace("{{DOCUMENT_TEXT}}", document_text[:4000])

        try:
            result_json = self.ai_service.complete_json(prompt)
            doc_type = str(result_json.get("document_type", "unknown")).lower()
            confidence = str(result_json.get("confidence", "low")).lower()

            if doc_type not in VALID_DOCUMENT_TYPES:
                doc_type = "unknown"
                confidence = "low"

            return DocumentClassification(document_type=doc_type, confidence=confidence)
        except Exception:
            return DocumentClassification(document_type="unknown", confidence="low")

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class NormalizedTerm(BaseModel):
    original: str = Field(description="Original term as documented")
    normalized: Optional[str] = Field(default=None, description="Normalized standard medical term or null if ambiguous")

# Dictionary of standard medical diagnosis mappings
DIAGNOSIS_MAP = {
    "t2dm": "Type 2 Diabetes Mellitus",
    "type 2 dm": "Type 2 Diabetes Mellitus",
    "type 2 diabetes": "Type 2 Diabetes Mellitus",
    "dm2": "Type 2 Diabetes Mellitus",
    "dm": "Diabetes Mellitus",
    "htn": "Hypertension",
    "essential hypertension": "Hypertension",
    "high blood pressure": "Hypertension",
    "cad": "Coronary Artery Disease",
    "ckd": "Chronic Kidney Disease",
    "copd": "Chronic Obstructive Pulmonary Disease",
    "gerd": "Gastroesophageal Reflux Disease"
}

# Dictionary of standard medication name mappings
MEDICATION_MAP = {
    "glucophage": "Metformin",
    "metformin hcl": "Metformin",
    "lipitor": "Atorvastatin",
    "atorvastatin calcium": "Atorvastatin",
    "zestril": "Lisinopril",
    "prinivil": "Lisinopril",
    "norvasc": "Amlodipine",
    "amlodipine besylate": "Amlodipine",
    "synthroid": "Levothyroxine",
    "cozaar": "Losartan",
    "plavix": "Clopidogrel"
}

class NormalizationService:
    """
    Normalizes medical diagnoses and medication terminology while strictly preserving
    the original raw text. Returns null for ambiguous terms.
    """

    def normalize_diagnosis(self, original_text: str) -> NormalizedTerm:
        """
        Normalizes a diagnosis term.
        Returns NormalizedTerm object.
        """
        if not original_text or not original_text.strip():
            return NormalizedTerm(original=original_text or "", normalized=None)

        clean_text = original_text.strip()
        lower_key = clean_text.lower()

        normalized_val = DIAGNOSIS_MAP.get(lower_key)
        return NormalizedTerm(original=clean_text, normalized=normalized_val)

    def normalize_medication(self, original_name: str) -> NormalizedTerm:
        """
        Normalizes a medication brand/synonym to canonical generic name.
        Does NOT alter or infer dosage.
        """
        if not original_name or not original_name.strip():
            return NormalizedTerm(original=original_name or "", normalized=None)

        clean_name = original_name.strip()
        lower_key = clean_name.lower()

        normalized_val = MEDICATION_MAP.get(lower_key)
        return NormalizedTerm(original=clean_name, normalized=normalized_val)

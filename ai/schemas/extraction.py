from typing import List, Optional
from pydantic import BaseModel, Field

from ai.schemas.evidence import EvidenceSchema

class Diagnosis(BaseModel):
    text: str = Field(description="Documented diagnosis text")
    normalized_text: Optional[str] = Field(default=None, description="Normalized medical diagnosis name")
    status: Optional[str] = Field(default="documented", description="Status: documented, suspected, or ruled_out")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class Medication(BaseModel):
    name: str = Field(description="Name of the medication")
    normalized_name: Optional[str] = Field(default=None, description="Normalized generic drug name")
    dosage: Optional[str] = Field(default=None, description="Dosage (e.g. 500 mg). NEVER infer if missing.")
    frequency: Optional[str] = Field(default=None, description="Frequency (e.g. twice daily)")
    route: Optional[str] = Field(default=None, description="Route (e.g. oral, IV)")
    status: Optional[str] = Field(default=None, description="Medication status (active, discontinued). NEVER infer.")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class LabResult(BaseModel):
    test_name: str = Field(description="Name of the laboratory test")
    value: str = Field(description="Test result value (original string preserve)")
    unit: Optional[str] = Field(default=None, description="Unit of measurement")
    reference_range: Optional[str] = Field(default=None, description="Reference range for normal values")
    status: Optional[str] = Field(default=None, description="Status (e.g. normal, elevated, low)")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class Vital(BaseModel):
    name: str = Field(description="Vital sign name (blood_pressure, heart_rate, temperature, etc.)")
    value: str = Field(description="Vital sign value")
    unit: Optional[str] = Field(default=None, description="Unit of measurement. Do not infer if missing.")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class Procedure(BaseModel):
    name: str = Field(description="Name of procedure or surgery")
    date: Optional[str] = Field(default=None, description="Date of procedure if explicitly documented")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class Allergy(BaseModel):
    substance: str = Field(description="Allergen substance (e.g. Penicillin)")
    reaction: Optional[str] = Field(default=None, description="Documented reaction (e.g. Rash)")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: Optional[EvidenceSchema] = Field(default=None, description="Supporting evidence location")

class CanonicalMedicalExtraction(BaseModel):
    document_type: str = Field(default="unknown")
    date: Optional[str] = Field(default=None, description="Event date in YYYY-MM-DD or partial string format")
    patient_name: Optional[str] = Field(default=None)
    hospital: Optional[str] = Field(default=None)
    doctor: Optional[str] = Field(default=None)
    diagnoses: List[Diagnosis] = Field(default_factory=list)
    symptoms: List[str] = Field(default_factory=list)
    medications: List[Medication] = Field(default_factory=list)
    allergies: List[Allergy] = Field(default_factory=list)
    lab_results: List[LabResult] = Field(default_factory=list)
    procedures: List[Procedure] = Field(default_factory=list)
    vitals: List[Vital] = Field(default_factory=list)
    past_medical_history: List[str] = Field(default_factory=list)
    follow_up: Optional[str] = Field(default=None)
    evidence: List[EvidenceSchema] = Field(default_factory=list)

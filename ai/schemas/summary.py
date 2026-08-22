from typing import List, Optional, Any
from pydantic import BaseModel, Field

class MedicalBriefing(BaseModel):
    patient_overview: str = Field(description="Executive clinical summary of patient profile and key history")
    major_diagnoses: List[str] = Field(default_factory=list, description="Documented active and past major diagnoses")
    medical_history: List[str] = Field(default_factory=list, description="Past medical history notes")
    previous_procedures: List[str] = Field(default_factory=list, description="Documented surgeries or procedures")
    medications: List[str] = Field(default_factory=list, description="Current and past medications with dosage")
    important_lab_results: List[str] = Field(default_factory=list, description="Key laboratory values and test findings")
    recent_events: List[str] = Field(default_factory=list, description="Chronological recent medical events")
    important_points_for_doctor: List[str] = Field(default_factory=list, description="High-priority clinical review points")
    uncertain_information: List[str] = Field(default_factory=list, description="Items lacking evidence or clear dates")
    conflicts: List[str] = Field(default_factory=list, description="Identified conflicting medical data points")

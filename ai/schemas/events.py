from typing import Optional, List
from pydantic import BaseModel, Field

class MedicalEvent(BaseModel):
    patient_id: Optional[str] = Field(default=None, description="Patient identifier")
    document_id: Optional[str] = Field(default=None, description="Source document identifier")
    filename: Optional[str] = Field(default=None, description="Source document filename")
    event_date: Optional[str] = Field(default=None, description="Event date (YYYY-MM-DD or null)")
    event_type: str = Field(description="Type of event: consultation, diagnosis, medication, lab_test, procedure, hospitalization, discharge, follow_up, other")
    title: str = Field(description="Short summary title of the event")
    description: str = Field(description="Detailed description of the clinical event")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    page_number: int = Field(default=1, description="Source page number")
    source_text: str = Field(default="", description="Supporting source excerpt")

class Timeline(BaseModel):
    patient_id: Optional[str] = Field(default=None)
    events: List[MedicalEvent] = Field(default_factory=list)

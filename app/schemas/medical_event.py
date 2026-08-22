from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class MedicalEventEvidence(BaseModel):
    document_id: Optional[str] = None
    page_number: Optional[int] = None
    source_text: Optional[str] = None

class MedicalEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    document_id: Optional[str] = None
    event_date: Optional[str] = None
    event_type: str
    title: str
    description: Optional[str] = None
    confidence: Optional[str] = None
    page_number: Optional[int] = None
    source_text: Optional[str] = None
    created_at: datetime
    evidence: Optional[MedicalEventEvidence] = None

class TimelineResponse(BaseModel):
    events: List[MedicalEventResponse]

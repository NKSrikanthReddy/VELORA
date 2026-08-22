from datetime import datetime
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, ConfigDict

class SummaryStructure(BaseModel):
    patient_overview: str
    major_diagnoses: List[str] = []
    medical_history: List[str] = []
    previous_procedures: List[str] = []
    medications: List[Dict[str, Any]] = []
    important_lab_results: List[Dict[str, Any]] = []
    recent_events: List[Dict[str, Any]] = []
    important_points_for_doctor: List[str] = []
    uncertain_information: List[str] = []
    conflicts: List[str] = []

class SummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    summary_json: Dict[str, Any]
    model_name: Optional[str] = None
    created_at: datetime

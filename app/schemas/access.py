from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AccessCodeClaim(BaseModel):
    access_code: str

class DoctorPatientAccessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: Optional[str] = None
    access_code: str
    status: str
    granted_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    created_at: datetime

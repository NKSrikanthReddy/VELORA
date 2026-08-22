from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class PatientCreate(BaseModel):
    name: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None

class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    name: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    created_at: datetime
    updated_at: datetime

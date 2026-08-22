from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    filename: str
    document_type: str
    storage_url: str
    mime_type: str
    file_size: int
    upload_date: datetime
    processing_status: str
    processing_error: Optional[str] = None
    extracted_text: Optional[str] = None
    created_at: datetime

class DocumentProcessResponse(BaseModel):
    document_id: str
    status: str
    message: str

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ChatQuestionRequest(BaseModel):
    question: str

class ChatEvidenceResponse(BaseModel):
    document_id: Optional[str] = None
    filename: Optional[str] = None
    page_number: Optional[int] = None
    source_text: Optional[str] = None
    relevance_score: Optional[float] = None

class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    role: str
    message: str
    evidence: List[ChatEvidenceResponse] = []
    created_at: datetime

class QAResponse(BaseModel):
    answer: str
    status: str  # answered, not_found, uncertain, conflict
    evidence: List[ChatEvidenceResponse] = []

class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: str
    created_at: datetime
    updated_at: datetime

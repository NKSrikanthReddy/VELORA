from typing import List, Optional
from pydantic import BaseModel, Field

from ai.schemas.evidence import EvidenceSchema

class QAResponse(BaseModel):
    answer: str = Field(description="Record-grounded answer to the physician's query")
    status: str = Field(description="Response status: answered, not_found, uncertain, conflict")
    confidence: str = Field(default="high", description="Confidence level: high, medium, low")
    evidence: List[EvidenceSchema] = Field(default_factory=list, description="Supporting evidence sources")

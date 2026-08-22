from typing import Optional
from pydantic import BaseModel, Field

class EvidenceSchema(BaseModel):
    document_id: Optional[str] = Field(default=None, description="Unique identifier of the source document")
    filename: Optional[str] = Field(default=None, description="Original filename of the medical document")
    page_number: int = Field(default=1, description="Page number where the source text was found")
    source_text: str = Field(description="Exact snippet of source text supporting the fact")

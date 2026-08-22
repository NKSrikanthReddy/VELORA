from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.medical_event import MedicalEvent
from app.models.document import Document
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import verify_requester_patient_access

router = APIRouter(prefix="/api/events", tags=["Evidence"])

class EvidenceResponse(BaseModel):
    event_id: str
    document_id: Optional[str] = None
    filename: Optional[str] = None
    page_number: Optional[int] = None
    source_text: Optional[str] = None
    document_url: Optional[str] = None

@router.get("/{event_id}/evidence", response_model=EvidenceResponse)
def get_event_evidence(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(MedicalEvent).filter(MedicalEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical event not found")

    # Step 1 & 2: Verify requester authorization for event's patient
    verify_requester_patient_access(event.patient_id, current_user, db)

    doc = None
    if event.document_id:
        doc = db.query(Document).filter(Document.id == event.document_id).first()

    return EvidenceResponse(
        event_id=event.id,
        document_id=event.document_id,
        filename=doc.filename if doc else None,
        page_number=event.page_number or 1,
        source_text=event.source_text or event.description,
        document_url=doc.storage_url if doc else None
    )

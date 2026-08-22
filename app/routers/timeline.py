from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.medical_event import MedicalEvent
from app.schemas.medical_event import TimelineResponse, MedicalEventResponse, MedicalEventEvidence
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import verify_requester_patient_access

router = APIRouter(prefix="/api/patients", tags=["Timeline"])

@router.get("/{patient_id}/timeline", response_model=TimelineResponse)
def get_patient_timeline(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verify_requester_patient_access(patient_id, current_user, db)

    events = db.query(MedicalEvent).filter(MedicalEvent.patient_id == patient_id).all()

    # Chronological sort: events with dates first (ascending/descending), null dates at the end
    def get_sort_key(ev: MedicalEvent):
        return (ev.event_date is None, ev.event_date or "")

    sorted_events = sorted(events, key=get_sort_key)

    response_events = []
    for ev in sorted_events:
        evidence = None
        if ev.document_id:
            evidence = MedicalEventEvidence(
                document_id=ev.document_id,
                page_number=ev.page_number or 1,
                source_text=ev.source_text
            )

        resp = MedicalEventResponse(
            id=ev.id,
            patient_id=ev.patient_id,
            document_id=ev.document_id,
            event_date=ev.event_date,
            event_type=ev.event_type,
            title=ev.title,
            description=ev.description,
            confidence=ev.confidence,
            page_number=ev.page_number,
            source_text=ev.source_text,
            created_at=ev.created_at,
            evidence=evidence
        )
        response_events.append(resp)

    return TimelineResponse(events=response_events)

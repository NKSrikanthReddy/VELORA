from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.document import Document
from app.models.medical_event import MedicalEvent
from app.models.access import DoctorPatientAccess
from app.schemas.access import AccessCodeClaim, DoctorPatientAccessResponse
from app.schemas.patient import PatientResponse
from app.schemas.document import DocumentResponse
from app.schemas.medical_event import TimelineResponse, MedicalEventResponse, MedicalEventEvidence
from app.schemas.summary import SummaryResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import require_doctor, verify_doctor_patient_access
from app.routers.summary import get_patient_summary

router = APIRouter(prefix="/api/doctor", tags=["Doctor Operations"])

@router.post("/access", response_model=DoctorPatientAccessResponse)
def claim_access_code(
    claim: AccessCodeClaim,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    code_str = claim.access_code.strip().upper()
    access = db.query(DoctorPatientAccess).filter(
        DoctorPatientAccess.access_code == code_str
    ).first()

    if not access:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid doctor access code."
        )

    if access.status == "revoked":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This access code has been revoked by the patient."
        )

    if access.status == "expired" or (access.expires_at and access.expires_at < datetime.utcnow()):
        access.status = "expired"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This access code has expired."
        )

    # Link doctor to access record
    access.doctor_id = current_user.id
    access.status = "active"
    access.granted_at = datetime.utcnow()
    db.commit()
    db.refresh(access)
    return access

@router.get("/patients", response_model=List[PatientResponse])
def get_authorized_patients(
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    active_accesses = db.query(DoctorPatientAccess).filter(
        DoctorPatientAccess.doctor_id == current_user.id,
        DoctorPatientAccess.status == "active"
    ).all()

    patient_ids = [a.patient_id for a in active_accesses]
    patients = db.query(Patient).filter(Patient.id.in_(patient_ids)).all() if patient_ids else []
    return patients

@router.get("/patients/{patient_id}", response_model=PatientResponse)
def get_doctor_patient_profile(
    patient_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    verify_doctor_patient_access(current_user.id, patient_id, db)
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
    return patient

@router.get("/patients/{patient_id}/documents", response_model=List[DocumentResponse])
def get_doctor_patient_documents(
    patient_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    verify_doctor_patient_access(current_user.id, patient_id, db)
    docs = db.query(Document).filter(Document.patient_id == patient_id).all()
    return docs

@router.get("/patients/{patient_id}/timeline", response_model=TimelineResponse)
def get_doctor_patient_timeline(
    patient_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    verify_doctor_patient_access(current_user.id, patient_id, db)
    events = db.query(MedicalEvent).filter(MedicalEvent.patient_id == patient_id).all()

    sorted_events = sorted(events, key=lambda ev: (ev.event_date is None, ev.event_date or ""))
    res_events = []
    for ev in sorted_events:
        evidence = MedicalEventEvidence(document_id=ev.document_id, page_number=ev.page_number or 1, source_text=ev.source_text) if ev.document_id else None
        res_events.append(MedicalEventResponse(
            id=ev.id, patient_id=ev.patient_id, document_id=ev.document_id,
            event_date=ev.event_date, event_type=ev.event_type, title=ev.title,
            description=ev.description, confidence=ev.confidence, page_number=ev.page_number,
            source_text=ev.source_text, created_at=ev.created_at, evidence=evidence
        ))
    return TimelineResponse(events=res_events)

@router.get("/patients/{patient_id}/summary", response_model=SummaryResponse)
def get_doctor_patient_summary(
    patient_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    verify_doctor_patient_access(current_user.id, patient_id, db)
    return get_patient_summary(patient_id, current_user, db)

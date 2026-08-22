from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.medical_event import MedicalEvent
from app.models.medication import Medication
from app.models.lab_result import LabResult
from app.models.summary import Summary
from app.schemas.summary import SummaryResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import verify_requester_patient_access, verify_patient_ownership
from app.services.summary_service import summary_service
from app.config import settings

router = APIRouter(prefix="/api/patients", tags=["Summary"])

def build_patient_records_dict(patient_id: str, db: Session) -> dict:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    events = db.query(MedicalEvent).filter(MedicalEvent.patient_id == patient_id).all()
    medications = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    labs = db.query(LabResult).filter(LabResult.patient_id == patient_id).all()

    return {
        "patient_name": patient.name if patient else "Patient",
        "events": [{"title": e.title, "event_date": e.event_date, "event_type": e.event_type, "description": e.description} for e in events],
        "medications": [{"name": m.name, "dosage": m.dosage, "frequency": m.frequency, "status": m.status} for m in medications],
        "lab_results": [{"test_name": l.test_name, "value": l.value, "unit": l.unit, "status": l.status} for l in labs]
    }

@router.get("/{patient_id}/summary", response_model=SummaryResponse)
def get_patient_summary(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verify_requester_patient_access(patient_id, current_user, db)

    latest_summary = db.query(Summary).filter(Summary.patient_id == patient_id).order_by(Summary.created_at.desc()).first()
    if latest_summary:
        return latest_summary

    # Generate if none exists
    patient_records = build_patient_records_dict(patient_id, db)
    summary_data = summary_service.generate_summary(patient_records)

    new_summary = Summary(
        patient_id=patient_id,
        summary_json=summary_data,
        model_name=settings.AI_MODEL
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    return new_summary

@router.post("/{patient_id}/summary", response_model=SummaryResponse)
def generate_patient_summary(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Patient owner or doctor with access can trigger regeneration
    verify_requester_patient_access(patient_id, current_user, db)

    patient_records = build_patient_records_dict(patient_id, db)
    summary_data = summary_service.generate_summary(patient_records)

    new_summary = Summary(
        patient_id=patient_id,
        summary_json=summary_data,
        model_name=settings.AI_MODEL
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    return new_summary

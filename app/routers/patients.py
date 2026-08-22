from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import require_patient, verify_patient_ownership, verify_requester_patient_access

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("/me", response_model=PatientResponse)
def get_my_patient_profile(
    current_user: User = Depends(require_patient),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        patient = Patient(
            user_id=current_user.id,
            name=current_user.name
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient_profile(
    patient_in: PatientCreate,
    current_user: User = Depends(require_patient),
    db: Session = Depends(get_db)
):
    existing = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if existing:
        return existing
        
    patient = Patient(
        user_id=current_user.id,
        name=patient_in.name,
        date_of_birth=patient_in.date_of_birth,
        gender=patient_in.gender
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_profile(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = verify_requester_patient_access(patient_id, current_user, db)
    return patient

from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.access import DoctorPatientAccess
from app.schemas.access import DoctorPatientAccessResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import verify_patient_ownership
from app.utils.access_codes import generate_access_code

router = APIRouter(prefix="/api/patients", tags=["Patient Access Control"])

@router.post("/{patient_id}/access", response_model=DoctorPatientAccessResponse, status_code=status.HTTP_201_CREATED)
def create_access_code(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = verify_patient_ownership(patient_id, current_user, db)

    code_str = generate_access_code()
    expires_at = datetime.utcnow() + timedelta(hours=24)

    # Note: doctor_id will be linked when doctor claims the access code
    access = DoctorPatientAccess(
        patient_id=patient.id,
        doctor_id=None,  # Pending doctor claim
        access_code=code_str,
        status="active",
        granted_at=None,
        expires_at=expires_at
    )
    db.add(access)
    db.commit()
    db.refresh(access)
    return access

@router.get("/{patient_id}/access", response_model=List[DoctorPatientAccessResponse])
def list_patient_access_codes(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verify_patient_ownership(patient_id, current_user, db)
    access_list = db.query(DoctorPatientAccess).filter(DoctorPatientAccess.patient_id == patient_id).all()
    return access_list

@router.delete("/{patient_id}/access/{access_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_access_code(
    patient_id: str,
    access_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verify_patient_ownership(patient_id, current_user, db)

    access = db.query(DoctorPatientAccess).filter(
        DoctorPatientAccess.id == access_id,
        DoctorPatientAccess.patient_id == patient_id
    ).first()

    if not access:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Access record not found")

    access.status = "revoked"
    access.revoked_at = datetime.utcnow()
    db.commit()
    return None

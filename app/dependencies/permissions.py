from datetime import datetime
from typing import Callable, List
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.access import DoctorPatientAccess
from app.dependencies.auth import get_current_user

def require_roles(allowed_roles: List[str]) -> Callable:
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' is not authorized. Required: {allowed_roles}"
            )
        return current_user
    return role_checker

require_patient = require_roles(["patient", "admin"])
require_doctor = require_roles(["doctor", "admin"])
require_admin = require_roles(["admin"])

def verify_patient_ownership(patient_id: str, current_user: User, db: Session) -> Patient:
    """
    Verify that the current user owns the target patient record.
    Returns the Patient instance if authorized, raises 403 otherwise.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
    
    if current_user.role == "admin":
        return patient
        
    if patient.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only access your own patient profile."
        )
    return patient

def verify_doctor_patient_access(doctor_user_id: str, patient_id: str, db: Session) -> DoctorPatientAccess:
    """
    Verify that the doctor has active, non-expired, non-revoked access to the specified patient.
    Raises 403 Forbidden if not authorized.
    """
    access = db.query(DoctorPatientAccess).filter(
        DoctorPatientAccess.doctor_id == doctor_user_id,
        DoctorPatientAccess.patient_id == patient_id,
        DoctorPatientAccess.status == "active"
    ).first()

    if not access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Doctor does not have active authorization to access this patient's medical records."
        )
    
    if access.expires_at and access.expires_at < datetime.utcnow():
        access.status = "expired"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Doctor access code has expired."
        )
        
    return access

def verify_requester_patient_access(patient_id: str, current_user: User, db: Session) -> Patient:
    """
    Allows access if current user is either:
    1. The patient owner
    2. A doctor with active DoctorPatientAccess
    3. An admin
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient record not found")
        
    if current_user.role == "admin":
        return patient
        
    if current_user.role == "patient":
        if patient.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Patient mismatch."
            )
        return patient
        
    if current_user.role == "doctor":
        verify_doctor_patient_access(current_user.id, patient_id, db)
        return patient
        
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

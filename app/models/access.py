import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class DoctorPatientAccess(Base):
    __tablename__ = "doctor_patient_access"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    access_code = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False, default="active")  # active, expired, revoked
    granted_at = Column(DateTime, default=datetime.utcnow, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="doctor_accesses")
    doctor = relationship("User", back_populates="doctor_accesses", foreign_keys=[doctor_id])

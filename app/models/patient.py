import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="patient_profile")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan")
    medical_events = relationship("MedicalEvent", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    lab_results = relationship("LabResult", back_populates="patient", cascade="all, delete-orphan")
    doctor_accesses = relationship("DoctorPatientAccess", back_populates="patient", cascade="all, delete-orphan")
    summaries = relationship("Summary", back_populates="patient", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="patient", cascade="all, delete-orphan")

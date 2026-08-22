import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="patient")  # patient, doctor, admin
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    patient_profile = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete-orphan")
    doctor_accesses = relationship("DoctorPatientAccess", back_populates="doctor", foreign_keys="[DoctorPatientAccess.doctor_id]")
    doctor_chat_sessions = relationship("ChatSession", back_populates="doctor", foreign_keys="[ChatSession.doctor_id]")

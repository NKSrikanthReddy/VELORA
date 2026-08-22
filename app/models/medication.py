import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Medication(Base):
    __tablename__ = "medications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = Column(String, ForeignKey("medical_events.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    normalized_name = Column(String, nullable=True)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    route = Column(String, nullable=True)
    status = Column(String, nullable=True, default="active")
    source_document_id = Column(String, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    page_number = Column(Integer, nullable=True)
    source_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="medications")
    event = relationship("MedicalEvent", back_populates="medications")
    source_document = relationship("Document", back_populates="medications")

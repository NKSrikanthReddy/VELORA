import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class MedicalEvent(Base):
    __tablename__ = "medical_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(String, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    event_date = Column(String, nullable=True)  # YYYY-MM-DD or null if unknown
    event_type = Column(String, nullable=False, default="consultation")
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    confidence = Column(String, nullable=True, default="high")
    page_number = Column(Integer, nullable=True)
    source_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="medical_events")
    document = relationship("Document", back_populates="medical_events")
    medications = relationship("Medication", back_populates="event")
    lab_results = relationship("LabResult", back_populates="event")

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class LabResult(Base):
    __tablename__ = "lab_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = Column(String, ForeignKey("medical_events.id", ondelete="SET NULL"), nullable=True)
    test_name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    unit = Column(String, nullable=True)
    reference_range = Column(String, nullable=True)
    status = Column(String, nullable=True, default="normal")
    source_document_id = Column(String, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    page_number = Column(Integer, nullable=True)
    source_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="lab_results")
    event = relationship("MedicalEvent", back_populates="lab_results")
    source_document = relationship("Document", back_populates="lab_results")

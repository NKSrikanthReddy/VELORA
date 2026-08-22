import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    document_type = Column(String, nullable=False, default="unknown")
    storage_url = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    processing_status = Column(String, nullable=False, default="uploaded")  # uploaded, processing, completed, failed
    processing_error = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="documents")
    medical_events = relationship("MedicalEvent", back_populates="document", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="source_document")
    lab_results = relationship("LabResult", back_populates="source_document")

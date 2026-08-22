import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ChatEvidence(Base):
    __tablename__ = "chat_evidence"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String, ForeignKey("chat_messages.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(String, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    page_number = Column(Integer, nullable=True)
    source_text = Column(Text, nullable=True)
    relevance_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    message = relationship("ChatMessage", back_populates="evidence")

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.document import Document
from app.models.medical_event import MedicalEvent
from app.models.medication import Medication
from app.models.lab_result import LabResult
from app.models.chat import ChatSession, ChatMessage
from app.models.evidence import ChatEvidence
from app.schemas.chat import ChatQuestionRequest, QAResponse, ChatSessionResponse, ChatMessageResponse, ChatEvidenceResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import require_doctor, verify_doctor_patient_access
from app.services.qa_service import qa_service

router = APIRouter(prefix="/api/doctor", tags=["Doctor Clinical Q&A"])

@router.post("/patients/{patient_id}/chat", response_model=ChatSessionResponse)
def create_or_get_chat_session(
    patient_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    # Verify doctor authorization
    verify_doctor_patient_access(current_user.id, patient_id, db)

    session = db.query(ChatSession).filter(
        ChatSession.patient_id == patient_id,
        ChatSession.doctor_id == current_user.id
    ).first()

    if not session:
        session = ChatSession(
            patient_id=patient_id,
            doctor_id=current_user.id
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    return session

@router.get("/chat/{session_id}", response_model=ChatMessageResponse)
def get_chat_session_messages(
    session_id: str,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")

    verify_doctor_patient_access(current_user.id, session.patient_id, db)

    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    # Return latest message with evidence if present
    if not messages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No messages in chat session")

    latest_msg = messages[-1]
    ev_records = db.query(ChatEvidence).filter(ChatEvidence.message_id == latest_msg.id).all()
    ev_list = []
    for ev in ev_records:
        doc = db.query(Document).filter(Document.id == ev.document_id).first() if ev.document_id else None
        ev_list.append(ChatEvidenceResponse(
            document_id=ev.document_id,
            filename=doc.filename if doc else None,
            page_number=ev.page_number,
            source_text=ev.source_text,
            relevance_score=ev.relevance_score
        ))

    return ChatMessageResponse(
        id=latest_msg.id,
        session_id=latest_msg.session_id,
        role=latest_msg.role,
        message=latest_msg.message,
        evidence=ev_list,
        created_at=latest_msg.created_at
    )

@router.post("/chat/{session_id}/message", response_model=QAResponse)
def send_chat_message(
    session_id: str,
    body: ChatQuestionRequest,
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")

    # CRITICAL SECURITY STEP: Verify doctor access and determine target patient_id from authorization
    verify_doctor_patient_access(current_user.id, session.patient_id, db)
    target_patient_id = session.patient_id

    # Store doctor question message
    doc_msg = ChatMessage(
        session_id=session.id,
        role="doctor",
        message=body.question
    )
    db.add(doc_msg)
    db.commit()

    # Step 4 & 5: Retrieve ONLY target patient's records
    docs = db.query(Document).filter(Document.patient_id == target_patient_id).all()
    meds = db.query(Medication).filter(Medication.patient_id == target_patient_id).all()
    labs = db.query(LabResult).filter(LabResult.patient_id == target_patient_id).all()
    events = db.query(MedicalEvent).filter(MedicalEvent.patient_id == target_patient_id).all()

    patient_records = {
        "documents": [{"id": d.id, "filename": d.filename, "extracted_text": d.extracted_text} for d in docs],
        "medications": [{"name": m.name, "dosage": m.dosage, "frequency": m.frequency, "status": m.status, "source_document_id": m.source_document_id, "page_number": m.page_number, "source_text": m.source_text} for m in meds],
        "lab_results": [{"test_name": l.test_name, "value": l.value, "unit": l.unit, "reference_range": l.reference_range, "status": l.status, "source_document_id": l.source_document_id, "page_number": l.page_number, "source_text": l.source_text} for l in labs],
        "events": [{"title": e.title, "event_date": e.event_date, "description": e.description, "document_id": e.document_id, "page_number": e.page_number, "source_text": e.source_text} for e in events]
    }

    # Step 6 & 7: Query Q&A Service
    qa_response = qa_service.answer_question(body.question, patient_records)

    # Store assistant answer message
    asst_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        message=qa_response.answer
    )
    db.add(asst_msg)
    db.commit()
    db.refresh(asst_msg)

    # Store evidence references linked to assistant message
    for ev in qa_response.evidence:
        ev_record = ChatEvidence(
            message_id=asst_msg.id,
            document_id=ev.document_id,
            page_number=ev.page_number or 1,
            source_text=ev.source_text,
            relevance_score=ev.relevance_score or 0.9
        )
        db.add(ev_record)
    db.commit()

    return qa_response

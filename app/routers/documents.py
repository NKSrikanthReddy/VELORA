import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.document import Document
from app.models.medical_event import MedicalEvent
from app.models.medication import Medication
from app.models.lab_result import LabResult
from app.schemas.document import DocumentResponse, DocumentProcessResponse
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import verify_patient_ownership, verify_requester_patient_access
from app.services.storage_service import storage_service
from app.services.ocr_service import ocr_service
from app.services.extraction_service import extraction_service
from app.services.normalization_service import normalization_service

router = APIRouter(prefix="/api", tags=["Documents"])

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "text/plain"
}

ALLOWED_EXTENSIONS = {".pdf", ".jpeg", ".jpg", ".png", ".txt"}

@router.post("/patients/{patient_id}/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    patient_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = verify_patient_ownership(patient_id, current_user, db)

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed types: PDF, JPG, JPEG, PNG, TXT."
        )

    file_bytes = await file.read()
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_MB}MB."
        )

    storage_url, _ = storage_service.save_file(file_bytes, patient_id, file.filename)

    document = Document(
        patient_id=patient.id,
        filename=file.filename,
        document_type="unknown",
        storage_url=storage_url,
        mime_type=file.content_type or "application/octet-stream",
        file_size=len(file_bytes),
        processing_status="uploaded"
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

@router.get("/patients/{patient_id}/documents", response_model=List[DocumentResponse])
def get_patient_documents(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verify_requester_patient_access(patient_id, current_user, db)
    documents = db.query(Document).filter(Document.patient_id == patient_id).all()
    return documents

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document_details(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    verify_requester_patient_access(doc.patient_id, current_user, db)
    return doc

@router.get("/documents/file/{patient_id}/{filename}")
def get_document_file(
    patient_id: str,
    filename: str,
    db: Session = Depends(get_db)
):
    # Public local file route for fallback demo rendering
    local_path = os.path.join(settings.LOCAL_STORAGE_DIR, patient_id, filename)
    if not os.path.exists(local_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return FileResponse(local_path)

@router.post("/documents/{document_id}/process", response_model=DocumentProcessResponse)
def process_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    verify_patient_ownership(doc.patient_id, current_user, db)

    doc.processing_status = "processing"
    db.commit()

    try:
        # Step 1: Read file bytes & run OCR
        file_bytes = storage_service.get_file_bytes(doc.patient_id, doc.filename)
        extracted_text = ocr_service.extract_text(file_bytes, doc.filename, doc.mime_type)
        doc.extracted_text = extracted_text

        # Step 2: Run AI Extraction & Validation
        raw_extraction = extraction_service.extract(extracted_text, doc.filename)

        # Step 3: Run Normalization
        norm_extraction = normalization_service.normalize(raw_extraction)

        doc.document_type = norm_extraction.document_type

        # Step 4: Persist Medical Event
        event_title = f"{norm_extraction.document_type.replace('_', ' ').title()} record documented"
        if norm_extraction.diagnoses:
            event_title = norm_extraction.diagnoses[0].get("title", event_title)

        med_event = MedicalEvent(
            patient_id=doc.patient_id,
            document_id=doc.id,
            event_date=norm_extraction.date,
            event_type=norm_extraction.document_type,
            title=event_title,
            description=f"Automated extraction from {doc.filename}. Hospital: {norm_extraction.hospital or 'N/A'}.",
            confidence="high",
            page_number=1,
            source_text=extracted_text[:300]
        )
        db.add(med_event)
        db.commit()
        db.refresh(med_event)

        # Step 5: Persist Medications
        for m in norm_extraction.medications:
            med_record = Medication(
                patient_id=doc.patient_id,
                event_id=med_event.id,
                name=m.name,
                dosage=m.dosage,
                frequency=m.frequency,
                route=m.route,
                status=m.status,
                source_document_id=doc.id,
                page_number=m.page_number or 1,
                source_text=m.source_text
            )
            db.add(med_record)

        # Step 6: Persist Lab Results
        for l in norm_extraction.lab_results:
            lab_record = LabResult(
                patient_id=doc.patient_id,
                event_id=med_event.id,
                test_name=l.test_name,
                value=l.value,
                unit=l.unit,
                reference_range=l.reference_range,
                status=l.status,
                source_document_id=doc.id,
                page_number=l.page_number or 1,
                source_text=l.source_text
            )
            db.add(lab_record)

        doc.processing_status = "completed"
        doc.processing_error = None
        db.commit()

        return DocumentProcessResponse(
            document_id=doc.id,
            status="completed",
            message="Document successfully processed and structured records extracted."
        )

    except Exception as e:
        doc.processing_status = "failed"
        doc.processing_error = str(e)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document processing failed: {str(e)}"
        )

# Velora Backend API Contract (For Member 1 - Frontend)

Base URL: `http://localhost:8000`

Interactive OpenAPI Docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Auth**: None
- **Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "email": "patient@demo.com",
    "password": "password123",
    "role": "patient"  // "patient" or "doctor"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "uuid-str",
      "name": "Rahul Sharma",
      "email": "patient@demo.com",
      "role": "patient",
      "created_at": "2026-08-22T12:00:00Z"
    }
  }
  ```

### `POST /api/auth/login`
- **Auth**: None
- **Body**:
  ```json
  {
    "email": "patient@demo.com",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`): Token object as above.

### `GET /api/auth/me`
- **Auth**: Bearer Token
- **Response** (`200 OK`): `UserResponse` object.

---

## 2. Patients (`/api/patients`)

### `POST /api/patients`
- **Auth**: Bearer Token (role: `patient`)
- **Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "date_of_birth": "1982-05-14",
    "gender": "Male"
  }
  ```

### `GET /api/patients/{patient_id}`
- **Auth**: Bearer Token (Patient Owner or Doctor with active access)

---

## 3. Documents (`/api/patients/{patient_id}/documents`)

### `POST /api/patients/{patient_id}/documents`
- **Auth**: Bearer Token (Patient Owner)
- **Form Data**: `file` (PDF, PNG, JPG, JPEG, TXT, Max 20MB)
- **Response**:
  ```json
  {
    "id": "doc-uuid",
    "patient_id": "patient-uuid",
    "filename": "blood_report.pdf",
    "document_type": "unknown",
    "storage_url": "/api/documents/file/patient-uuid/blood_report.pdf",
    "mime_type": "application/pdf",
    "file_size": 46080,
    "upload_date": "2026-08-22T12:00:00Z",
    "processing_status": "uploaded"
  }
  ```

### `POST /api/documents/{document_id}/process`
- **Auth**: Bearer Token (Patient Owner)
- **Response**: `{"document_id": "...", "status": "completed", "message": "..."}`

### `GET /api/patients/{patient_id}/documents`
- **Auth**: Bearer Token (Authorized Patient or Doctor)

---

## 4. Timeline & Summary

### `GET /api/patients/{patient_id}/timeline`
- **Auth**: Bearer Token (Authorized Patient or Doctor)
- **Response**:
  ```json
  {
    "events": [
      {
        "id": "event-1",
        "patient_id": "p-1",
        "document_id": "doc-1",
        "event_date": "2025-02-01",
        "event_type": "lab_report",
        "title": "Annual Checkup - HbA1c 7.4%",
        "description": "...",
        "confidence": "high",
        "evidence": {
          "document_id": "doc-1",
          "page_number": 1,
          "source_text": "HbA1c: 7.4%"
        }
      }
    ]
  }
  ```

### `GET /api/patients/{patient_id}/summary`
- **Auth**: Bearer Token (Authorized Patient or Doctor)

---

## 5. Doctor-Patient Access (`/api/patients` & `/api/doctor`)

### `POST /api/patients/{patient_id}/access`
- **Auth**: Bearer Token (Patient Owner)
- **Response**: `{"id": "...", "access_code": "MED-7K29X", "status": "active", ...}`

### `DELETE /api/patients/{patient_id}/access/{access_id}`
- **Auth**: Bearer Token (Patient Owner) -> **Revokes doctor access immediately**

### `POST /api/doctor/access`
- **Auth**: Bearer Token (Doctor)
- **Body**: `{"access_code": "MED-7K29X"}`

### `GET /api/doctor/patients`
- **Auth**: Bearer Token (Doctor) -> Lists all authorized patient profiles.

---

## 6. Evidence API (`/api/events/{event_id}/evidence`)

### `GET /api/events/{event_id}/evidence`
- **Auth**: Bearer Token (Patient Owner or Doctor with active access)
- **Response**:
  ```json
  {
    "event_id": "event-1",
    "document_id": "doc-1",
    "filename": "blood_report.pdf",
    "page_number": 1,
    "source_text": "HbA1c: 7.4% (Improved)",
    "document_url": "/api/documents/file/p-1/blood_report.pdf"
  }
  ```

---

## 7. Scoped Doctor Q&A Chat (`/api/doctor`)

### `POST /api/doctor/patients/{patient_id}/chat`
- **Auth**: Bearer Token (Doctor with active access)

### `POST /api/doctor/chat/{session_id}/message`
- **Auth**: Bearer Token (Doctor with active access)
- **Body**: `{"question": "What medications has this patient taken for diabetes?"}`
- **Response**:
  ```json
  {
    "answer": "According to the patient's documented medical records, Rahul Sharma is prescribed Metformin 500mg...",
    "status": "answered",
    "evidence": [
      {
        "document_id": "doc-3",
        "filename": "prescription_diabetes_2023.pdf",
        "page_number": 1,
        "source_text": "Metformin 500mg PO Twice Daily with meals",
        "relevance_score": 0.96
      }
    ]
  }
  ```

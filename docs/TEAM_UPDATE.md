# TEAM UPDATE

## Member 1 (Frontend, Dashboard & UI):
- All REST endpoints are fully functional and documented in `docs/API_CONTRACT.md`.
- CORS is pre-configured to accept requests from `http://localhost:3000` and `http://localhost:5173`.
- Authenticate via `POST /api/auth/login` to obtain a JWT Bearer token, then include header `Authorization: Bearer <token>` in subsequent API calls.
- Doctor access flow:
  1. Patient clicks "Generate Access Code" -> calls `POST /api/patients/{patient_id}/access` -> gets `MED-XXXXX`.
  2. Doctor enters code in dashboard -> calls `POST /api/doctor/access` with `{"access_code": "MED-XXXXX"}`.
  3. Doctor can now fetch authorized patients list via `GET /api/doctor/patients`.

## Member 2 (AI/ML & OCR):
- All service abstractions are cleanly decoupled in `app/services/`:
  - `OCRService` (`app/services/ocr_service.py`): swap `DefaultOCRService` with Tesseract/Vision API.
  - `ExtractionService` (`app/services/extraction_service.py`): accepts OCR text and returns `CanonicalMedicalExtraction` Pydantic model.
  - `NormalizationService` (`app/services/normalization_service.py`): standardizes drug names & lab codes.
  - `SummaryService` (`app/services/summary_service.py`): produces structured clinical briefing JSON.
  - `QuestionAnswerService` (`app/services/qa_service.py`): receives scoped patient records dict and answers queries with evidence citations.
- FastAPI routes automatically invoke these service interfaces. You can upgrade AI models without altering any FastAPI routes.

## Member 3 (Backend & Integration):
- Complete backend implementation with PostgreSQL/Supabase & SQLite local fallback, Alembic migration setup, security RBAC, patient data isolation, temporary access codes, and 7-document fictional demo seed script (`scripts/seed_demo.py`).

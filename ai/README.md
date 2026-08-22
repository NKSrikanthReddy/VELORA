# AI & Document Intelligence Subsystem (Member 2 Deliverable)

This directory contains the complete AI/ML and document intelligence subsystem for the **AI-Powered Medical Record Consolidation and Clinical Briefing System**.

## System Architecture

```
[Raw Documents: PDF / Images]
           │
           ▼
[PDF Extractor + OCR Fallback Service] ──> Page-Level Text Streams
           │
           ▼
[Document Classifier] ──> Category (consultation, lab, admission, etc.)
           │
           ▼
[Canonical Medical Extractor] ──> Structured Pydantic Record + Page Evidence
           │
           ▼
[Normalization Service] ──> Standardized Terminology (preserving raw text)
           │
           ▼
[Event & Timeline Generator] ──> Chronological Medical Event Timeline
           │
           ▼
[Conflict Detection Engine] ──> Discrepancies & Dosage/Diagnosis Conflicts
           │
           ├──> [Summary Service] ──> AI Medical Briefing for Doctor
           │
           └──> [Patient-Scoped Retrieval & Q&A] ──> "Ask My Records" Engine
```

---

## Installation & Setup

1. **Install Dependencies**:
```bash
python3 -m pip install pypdf pytesseract pdf2image pydantic openai google-genai pytest
```

2. **Environment Variables** (`.env`):
Copy `.env.example` to `.env` and populate keys:
```bash
AI_API_KEY=your_openai_or_gemini_api_key
AI_MODEL=gpt-4o-mini
OCR_PROVIDER=pytesseract
OCR_MIN_TEXT_LENGTH=50
DEMO_MODE=true
```

---

## Key Modules & Services

1. **PDF Text Extractor** (`ai/services/pdf_extractor.py`):
   - Page-by-page text extraction retaining `page_number` metadata for source attribution.
2. **OCR Fallback** (`ai/services/ocr_service.py`):
   - Triggers OCR when extracted page text falls below `OCR_MIN_TEXT_LENGTH`. Supports PNG/JPG images and scanned PDF pages.
3. **Document Classifier** (`ai/services/document_classifier.py`):
   - Classifies medical notes into `consultation`, `prescription`, `lab_report`, `diagnostic_report`, `admission`, `discharge_summary`, `follow_up`, `other`, `unknown`.
4. **Canonical Medical Extractor** (`ai/services/medical_extractor.py`):
   - Extracts structured Diagnoses, Medications, Lab Results, Vitals, Procedures, and Allergies into Pydantic models.
   - Never infers missing dosages or statuses; attaches source page & snippet evidence to every fact.
5. **Terminology Normalizer** (`ai/services/normalization_service.py`):
   - Maps medical acronyms (e.g. `T2DM` -> `Type 2 Diabetes Mellitus`) while strictly preserving original raw text.
6. **Medical Event & Timeline Engine** (`ai/services/event_service.py`):
   - Deduplicates clinical events, sorts chronologically, and preserves undated records at the end without fabricating dates.
7. **Conflict Detection Engine** (`ai/services/conflict_service.py`):
   - Detects dosage conflicts (e.g., Metformin 500 mg vs 850 mg), status contradictions, and flags them as `needs_verification`.
8. **AI Medical Briefing** (`ai/services/summary_service.py`):
   - Synthesizes structured clinical briefings for doctors based strictly on consolidated patient records.
9. **Record-Grounded Q&A / Ask My Records** (`ai/services/qa_service.py`):
   - Scopes all queries strictly to `patient_id`. Answers using patient records only, handling missing facts (`status: not_found`) and clinical conflicts (`status: conflict`).

---

## Integration Contracts

### Interface for Member 3 (FastAPI Backend)
Use `MedicalAIInterface` in `ai/interface.py`:
```python
from ai.interface import MedicalAIInterface

ai_module = MedicalAIInterface()

# Process document upload
record = ai_module.extract_document(patient_id="pat_12", document_id="doc_1", file_source="report.pdf")

# Generate chronological timeline
timeline = ai_module.generate_timeline(patient_id="pat_12", extractions_dicts=[record])

# Generate doctor briefing
briefing = ai_module.generate_briefing(patient_id="pat_12", extractions_dicts=[record])

# Answer doctor query
qa_response = ai_module.answer_question(patient_id="pat_12", question="What was the latest HbA1c?", extractions_dicts=[record])
```

### Integration for Member 1 (Frontend UI)
Every extracted fact and Q&A answer exposes an `evidence` array containing:
```json
{
  "document_id": "doc_002",
  "filename": "lab_report_2023.pdf",
  "page_number": 1,
  "source_text": "HbA1c: 7.4 %"
}
```
This enables the frontend to display interactive `[View Source]` buttons for doctors.

---

## Running Unit & Integration Tests

Run the full pytest suite:
```bash
python3 -m pytest ai/tests/ -v
```
All 19 unit and end-to-end integration tests execute and pass in < 1 second.

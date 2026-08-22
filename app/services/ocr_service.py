from abc import ABC, abstractmethod

class BaseOCRService(ABC):
    @abstractmethod
    def extract_text(self, file_bytes: bytes, filename: str, mime_type: str) -> str:
        """Extract plain text from document bytes."""
        pass

class DefaultOCRService(BaseOCRService):
    def extract_text(self, file_bytes: bytes, filename: str, mime_type: str) -> str:
        """
        Default OCR implementation for Member 2 integration.
        Extracts UTF-8 text if plain text, or returns heuristic/mock OCR text for demonstration.
        Member 2 can swap this with pytesseract, easyocr, or PDF parser.
        """
        if mime_type == "text/plain":
            try:
                return file_bytes.decode("utf-8")
            except Exception:
                pass
        
        # Fallback pre-extracted demo text matching document filename keyword
        filename_lower = filename.lower()
        if "lab" in filename_lower or "blood" in filename_lower:
            return """ABC Diagnostic Center - Blood Lab Report
Date: 2025-06-12
Patient Name: Rahul Sharma, Age: 42, Gender: Male
Test Name: HbA1c (Glycated Hemoglobin)
Result: 7.4 % (Reference Range: 4.0 - 5.6 %, Status: High)
Fasting Blood Sugar: 145 mg/dL (Reference Range: 70 - 99 mg/dL, Status: High)
Serum Creatinine: 0.9 mg/dL (Reference Range: 0.7 - 1.3 mg/dL, Status: Normal)
Notes: Patient presents elevated glycated hemoglobin consistent with Type 2 Diabetes Mellitus."""
        elif "prescription" in filename_lower or "med" in filename_lower:
            return """City Health Clinic - Prescription
Date: 2025-06-14
Doctor: Dr. A. K. Gupta, MD (Internal Medicine)
Patient: Rahul Sharma
Rx:
1. Metformin 500mg - 1 tablet twice daily with meals (Oral) - Active
2. Glimepiride 1mg - 1 tablet once daily before breakfast (Oral) - Active
3. Atorvastatin 10mg - 1 tablet at bedtime (Oral) - Active
Follow-up in 30 days."""
        elif "discharge" in filename_lower or "admission" in filename_lower:
            return """Apex Hospital - Discharge Summary
Admission Date: 2024-11-10
Discharge Date: 2024-11-12
Patient: Rahul Sharma
Primary Diagnosis: Acute Gastroenteritis with mild dehydration
Procedure: IV Fluid Rehydration & Symptomatic Management
Condition at Discharge: Stable, afebril, tolerating oral intake."""
        else:
            return f"Extracted text content for document {filename}.\nDate: 2025-01-15.\nPatient documented in consultation with stable vitals."

ocr_service: BaseOCRService = DefaultOCRService()

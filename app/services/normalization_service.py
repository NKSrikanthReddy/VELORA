from abc import ABC, abstractmethod
from app.services.extraction_service import CanonicalMedicalExtraction, ExtractedMedication, ExtractedLabResult

class BaseNormalizationService(ABC):
    @abstractmethod
    def normalize(self, extraction: CanonicalMedicalExtraction) -> CanonicalMedicalExtraction:
        """Normalize extracted medical data into canonical standard representations."""
        pass

class DefaultNormalizationService(BaseNormalizationService):
    def normalize(self, extraction: CanonicalMedicalExtraction) -> CanonicalMedicalExtraction:
        """Standardize drug names, lab test names, and status codes."""
        normalized_meds = []
        for med in extraction.medications:
            norm_name = med.name.strip().title()
            # Clean common brand name variants or extra details
            if "metformin" in med.name.lower():
                norm_name = "Metformin"
            elif "glimepiride" in med.name.lower():
                norm_name = "Glimepiride"
            elif "atorvastatin" in med.name.lower():
                norm_name = "Atorvastatin"

            normalized_meds.append(ExtractedMedication(
                name=med.name,
                dosage=med.dosage,
                frequency=med.frequency,
                route=med.route or "Oral",
                status=med.status or "active",
                page_number=med.page_number,
                source_text=med.source_text
            ))

        normalized_labs = []
        for lab in extraction.lab_results:
            norm_test = lab.test_name.strip()
            if "hba1c" in lab.test_name.lower():
                norm_test = "HbA1c"
            elif "fasting blood sugar" in lab.test_name.lower() or "fbs" in lab.test_name.lower():
                norm_test = "Fasting Blood Sugar"

            normalized_labs.append(ExtractedLabResult(
                test_name=norm_test,
                value=lab.value,
                unit=lab.unit,
                reference_range=lab.reference_range,
                status=lab.status or "normal",
                page_number=lab.page_number,
                source_text=lab.source_text
            ))

        extraction.medications = normalized_meds
        extraction.lab_results = normalized_labs
        return extraction

normalization_service: BaseNormalizationService = DefaultNormalizationService()

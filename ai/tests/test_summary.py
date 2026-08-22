from ai.services.summary_service import SummaryService
from ai.fixtures.demo_data import FICTIONAL_DOCUMENTS

def test_medical_briefing_generation():
    service = SummaryService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    briefing = service.generate_briefing(extractions)

    assert briefing.patient_overview != ""
    assert len(briefing.major_diagnoses) > 0
    assert len(briefing.medications) > 0
    assert len(briefing.important_lab_results) > 0

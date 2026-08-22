from ai.services.conflict_service import ConflictService
from ai.fixtures.demo_data import FICTIONAL_DOCUMENTS

def test_medication_dosage_conflict():
    service = ConflictService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    conflicts = service.detect_conflicts(extractions)

    assert len(conflicts) > 0
    dosage_conflicts = [c for c in conflicts if c.type == "medication_dosage_conflict"]
    assert len(dosage_conflicts) > 0

    c = dosage_conflicts[0]
    assert "Metformin" in c.entity
    assert "500 mg" in c.values
    assert "850 mg" in c.values
    assert c.status == "needs_verification"

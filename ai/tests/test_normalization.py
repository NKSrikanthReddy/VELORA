from ai.services.normalization_service import NormalizationService

def test_diagnosis_normalization():
    norm = NormalizationService()
    res1 = norm.normalize_diagnosis("T2DM")
    assert res1.original == "T2DM"
    assert res1.normalized == "Type 2 Diabetes Mellitus"

    res2 = norm.normalize_diagnosis("HTN")
    assert res2.original == "HTN"
    assert res2.normalized == "Hypertension"

def test_medication_normalization():
    norm = NormalizationService()
    res = norm.normalize_medication("Glucophage")
    assert res.original == "Glucophage"
    assert res.normalized == "Metformin"

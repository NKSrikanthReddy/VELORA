from ai.services.medical_extractor import MedicalExtractor

def test_canonical_medical_extraction():
    extractor = MedicalExtractor()
    pages = [{"page_number": 1, "text": "Patient has Type 2 Diabetes Mellitus. Prescribed Metformin 500 mg twice daily. HbA1c: 7.4%."}]
    record = extractor.extract(pages, document_id="doc_1", filename="test.pdf")

    assert len(record.diagnoses) > 0
    assert "Diabetes" in record.diagnoses[0].text
    assert len(record.medications) > 0
    assert record.medications[0].name == "Metformin"
    assert record.medications[0].dosage == "500 mg"
    assert len(record.lab_results) > 0
    assert record.lab_results[0].test_name == "HbA1c"
    assert record.lab_results[0].value == "7.4"

def test_evidence_attachment():
    extractor = MedicalExtractor()
    pages = [{"page_number": 2, "text": "Metformin 500 mg oral."}]
    record = extractor.extract(pages, document_id="doc_42", filename="prescription.pdf")
    med = record.medications[0]
    assert med.evidence is not None
    assert med.evidence.document_id == "doc_42"
    assert med.evidence.filename == "prescription.pdf"

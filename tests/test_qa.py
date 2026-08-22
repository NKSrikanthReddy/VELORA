from app.services.qa_service import DefaultQuestionAnswerService

def test_qa_safety_guardrails():
    qa_service = DefaultQuestionAnswerService()
    patient_records = {"medications": [{"name": "Metformin", "dosage": "500mg"}]}

    # Treatment recommendation attempt
    res = qa_service.answer_question("Should I increase the patient's Metformin medication dosage?", patient_records)
    assert res.status == "uncertain"
    assert "does not provide treatment recommendations" in res.answer

def test_qa_medication_query():
    qa_service = DefaultQuestionAnswerService()
    patient_records = {
        "medications": [
            {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily", "status": "active", "source_document_id": "doc1", "page_number": 1, "source_text": "Metformin 500mg BID"}
        ]
    }

    res = qa_service.answer_question("What medications is the patient taking?", patient_records)
    assert res.status == "answered"
    assert "Metformin 500mg" in res.answer
    assert len(res.evidence) == 1
    assert res.evidence[0].document_id == "doc1"

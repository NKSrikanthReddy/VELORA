from ai.services.qa_service import QAService
from ai.fixtures.demo_data import FICTIONAL_DOCUMENTS, FICTIONAL_PATIENT_ID

def test_qa_not_found_scenario():
    qa = QAService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    res = qa.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What is the patient's blood group?",
        extractions=extractions
    )
    assert res.status == "not_found"
    assert "not find" in res.answer.lower() or "not found" in res.answer.lower() or "could not find" in res.answer.lower()
    assert len(res.evidence) == 0

def test_qa_hba1c_scenario():
    qa = QAService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    res = qa.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What was the latest HbA1c?",
        extractions=extractions
    )
    assert res.status == "answered"
    assert "7.4" in res.answer
    assert len(res.evidence) > 0

def test_qa_conflict_scenario():
    qa = QAService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    res = qa.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What is the Metformin dosage?",
        extractions=extractions
    )
    assert res.status == "conflict"
    assert len(res.evidence) >= 2

def test_qa_out_of_scope_advice():
    qa = QAService()
    extractions = [d["extraction"] for d in FICTIONAL_DOCUMENTS]
    res = qa.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="Should I increase the Metformin dosage?",
        extractions=extractions
    )
    assert "does not provide treatment" in res.answer.lower() or "medical advice" in res.answer.lower()

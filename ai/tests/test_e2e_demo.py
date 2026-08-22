from ai.interface import MedicalAIInterface
from ai.fixtures.demo_data import FICTIONAL_DOCUMENTS, FICTIONAL_PATIENT_ID

def test_full_end_to_end_demo_pipeline():
    interface = MedicalAIInterface()

    # 1. Process documents and extract canonical records
    processed_extractions = []
    for doc in FICTIONAL_DOCUMENTS:
        # Simulate extraction pipeline
        ext_dict = doc["extraction"].model_dump()
        processed_extractions.append(ext_dict)

    assert len(processed_extractions) == 7

    # 2. Generate Chronological Timeline
    timeline_dict = interface.generate_timeline(
        patient_id=FICTIONAL_PATIENT_ID,
        extractions_dicts=processed_extractions
    )
    assert "events" in timeline_dict
    assert len(timeline_dict["events"]) > 0

    # 3. Generate Clinical Briefing
    briefing_dict = interface.generate_briefing(
        patient_id=FICTIONAL_PATIENT_ID,
        extractions_dicts=processed_extractions
    )
    assert "patient_overview" in briefing_dict
    assert len(briefing_dict["major_diagnoses"]) > 0
    assert len(briefing_dict["conflicts"]) > 0

    # 4. Perform Ask My Records Q&A Queries
    # Query 1: Valid medication query
    qa1 = interface.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What medications has this patient taken?",
        extractions_dicts=processed_extractions
    )
    assert qa1["status"] in {"answered", "conflict"}
    assert len(qa1["evidence"]) > 0

    # Query 2: Missing record query (Blood Group)
    qa2 = interface.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What is the patient's blood group?",
        extractions_dicts=processed_extractions
    )
    assert qa2["status"] == "not_found"

    # Query 3: Latest HbA1c lab result
    qa3 = interface.answer_question(
        patient_id=FICTIONAL_PATIENT_ID,
        question="What was the latest HbA1c?",
        extractions_dicts=processed_extractions
    )
    assert qa3["status"] == "answered"
    assert "7.4" in qa3["answer"]

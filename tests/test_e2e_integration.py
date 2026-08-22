import pytest
import io

def test_full_patient_and_doctor_lifecycle(client):
    # 1. Register Patient User
    pat_reg = client.post("/api/auth/register", json={
        "name": "Arun Verma",
        "email": "arun.verma@example.com",
        "password": "securepassword123",
        "role": "patient"
    })
    assert pat_reg.status_code == 201
    pat_data = pat_reg.json()
    assert "access_token" in pat_data
    pat_token = pat_data["access_token"]

    # 2. Get Patient Profile
    me_pat = client.get("/api/patients/me", headers={"Authorization": f"Bearer {pat_token}"})
    assert me_pat.status_code == 200
    pat_profile = me_pat.json()
    pat_id = pat_profile["id"]
    assert pat_profile["name"] == "Arun Verma"

    # 3. Patient uploads a medical report
    pdf_content = b"%PDF-1.4 Mock Lab Blood Report HbA1c: 7.4% Fasting Blood Sugar: 145 mg/dL Date: 2025-06-12"
    files = {
        "file": ("blood_report_2025.pdf", io.BytesIO(pdf_content), "application/pdf")
    }
    upload_res = client.post(
        f"/api/patients/{pat_id}/documents",
        files=files,
        headers={"Authorization": f"Bearer {pat_token}"}
    )
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    assert doc_data["filename"] == "blood_report_2025.pdf"

    # 4. Trigger AI document processing
    process_res = client.post(
        f"/api/documents/{doc_id}/process",
        headers={"Authorization": f"Bearer {pat_token}"}
    )
    assert process_res.status_code == 200
    assert process_res.json()["status"] == "completed"

    # 5. Patient checks reconstructed timeline
    timeline_res = client.get(
        f"/api/patients/{pat_id}/timeline",
        headers={"Authorization": f"Bearer {pat_token}"}
    )
    assert timeline_res.status_code == 200
    timeline_events = timeline_res.json()["events"]
    assert len(timeline_events) >= 1

    # 6. Patient generates Doctor Access Code
    access_res = client.post(
        f"/api/patients/{pat_id}/access",
        headers={"Authorization": f"Bearer {pat_token}"}
    )
    assert access_res.status_code == 201
    access_code = access_res.json()["access_code"]
    assert access_code.startswith("MED-")

    # 7. Register & Login Doctor
    doc_reg = client.post("/api/auth/register", json={
        "name": "Dr. Sneha Roy",
        "email": "dr.sneha@clinic.com",
        "password": "doctorpassword123",
        "role": "doctor"
    })
    assert doc_reg.status_code == 201
    doc_token = doc_reg.json()["access_token"]

    # 8. Doctor claims access code
    claim_res = client.post(
        "/api/doctor/access",
        json={"access_code": access_code},
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert claim_res.status_code == 200
    assert claim_res.json()["status"] == "active"

    # 9. Doctor fetches authorized patients list
    doc_patients_res = client.get(
        "/api/doctor/patients",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert doc_patients_res.status_code == 200
    doc_patients = doc_patients_res.json()
    assert any(p["id"] == pat_id for p in doc_patients)

    # 10. Doctor views AI Clinical Briefing
    summary_res = client.get(
        f"/api/doctor/patients/{pat_id}/summary",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert summary_res.status_code == 200
    summary_json = summary_res.json()["summary_json"]
    assert "patient_overview" in summary_json

    # 11. Doctor opens Chat Session
    chat_session_res = client.post(
        f"/api/doctor/patients/{pat_id}/chat",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert chat_session_res.status_code == 200
    session_id = chat_session_res.json()["id"]

    # 12. Doctor queries "Ask My Records"
    qa_msg_res = client.post(
        f"/api/doctor/chat/{session_id}/message",
        json={"question": "What are the latest blood test and lab results for this patient?"},
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert qa_msg_res.status_code == 200
    qa_data = qa_msg_res.json()
    assert qa_data["status"] == "answered"
    assert "HbA1c" in qa_data["answer"] or "lab" in qa_data["answer"].lower()

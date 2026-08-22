def test_doctor_access_code_flow_and_revocation(client):
    # 1. Register Patient
    patient = client.post("/api/auth/register", json={
        "name": "Patient X", "email": "px@test.com", "password": "password123", "role": "patient"
    }).json()
    pat_token = patient["access_token"]
    pat_id = client.post("/api/patients", json={"name": "Patient X"}, headers={"Authorization": f"Bearer {pat_token}"}).json()["id"]

    # 2. Register Doctor
    doctor = client.post("/api/auth/register", json={
        "name": "Dr. Smith", "email": "doc@test.com", "password": "password123", "role": "doctor"
    }).json()
    doc_token = doctor["access_token"]

    # Doctor tries to access Patient X before authorization -> 403 Forbidden
    unauth_res = client.get(f"/api/doctor/patients/{pat_id}", headers={"Authorization": f"Bearer {doc_token}"})
    assert unauth_res.status_code == 403

    # 3. Patient generates access code
    access_code_res = client.post(f"/api/patients/{pat_id}/access", headers={"Authorization": f"Bearer {pat_token}"})
    assert access_code_res.status_code == 201
    code_data = access_code_res.json()
    access_code = code_data["access_code"]
    access_id = code_data["id"]
    assert access_code.startswith("MED-")

    # 4. Doctor claims access code
    claim_res = client.post("/api/doctor/access", json={"access_code": access_code}, headers={"Authorization": f"Bearer {doc_token}"})
    assert claim_res.status_code == 200
    assert claim_res.json()["status"] == "active"

    # 5. Doctor can now access patient profile
    auth_res = client.get(f"/api/doctor/patients/{pat_id}", headers={"Authorization": f"Bearer {doc_token}"})
    assert auth_res.status_code == 200
    assert auth_res.json()["id"] == pat_id

    # 6. Patient revokes access code
    del_res = client.delete(f"/api/patients/{pat_id}/access/{access_id}", headers={"Authorization": f"Bearer {pat_token}"})
    assert del_res.status_code == 204

    # 7. Doctor immediately loses access
    revoked_res = client.get(f"/api/doctor/patients/{pat_id}", headers={"Authorization": f"Bearer {doc_token}"})
    assert revoked_res.status_code == 403

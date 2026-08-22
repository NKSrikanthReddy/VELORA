def test_patient_cannot_access_other_patient_data(client):
    # Register Patient A
    p_a = client.post("/api/auth/register", json={
        "name": "Patient A", "email": "pa@test.com", "password": "password123", "role": "patient"
    }).json()
    token_a = p_a["access_token"]
    
    # Get Patient A profile ID
    patient_profile_a = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_a}"}).json()
    p_a_id = client.post("/api/patients", json={"name": "Patient A"}, headers={"Authorization": f"Bearer {token_a}"}).json()["id"]

    # Register Patient B
    p_b = client.post("/api/auth/register", json={
        "name": "Patient B", "email": "pb@test.com", "password": "password123", "role": "patient"
    }).json()
    token_b = p_b["access_token"]

    # Patient B attempts to access Patient A's profile
    res = client.get(f"/api/patients/{p_a_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res.status_code == 403
    assert "Access denied" in res.json()["detail"]

def test_patient_registration(client):
    res = client.post("/api/auth/register", json={
        "name": "Test Patient",
        "email": "patient@test.com",
        "password": "password123",
        "role": "patient"
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "patient@test.com"
    assert data["user"]["role"] == "patient"

def test_doctor_registration(client):
    res = client.post("/api/auth/register", json={
        "name": "Dr. Test Doctor",
        "email": "doctor@test.com",
        "password": "password123",
        "role": "doctor"
    })
    assert res.status_code == 201
    data = res.json()
    assert data["user"]["role"] == "doctor"

def test_login_success(client):
    # Register first
    client.post("/api/auth/register", json={
        "name": "Login User",
        "email": "login@test.com",
        "password": "password123",
        "role": "patient"
    })

    # Login
    res = client.post("/api/auth/login", json={
        "email": "login@test.com",
        "password": "password123"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_login_invalid_credentials(client):
    res = client.post("/api/auth/login", json={
        "email": "nonexistent@test.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401

def test_get_me(client):
    reg = client.post("/api/auth/register", json={
        "name": "Me User",
        "email": "me@test.com",
        "password": "password123",
        "role": "patient"
    }).json()
    token = reg["access_token"]

    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "me@test.com"

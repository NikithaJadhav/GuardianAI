def _valid_payload(**overrides):
    payload = {
        "accelerometer": 95,
        "gyroscope": 90,
        "gps_speed": 10,
        "inactivity_time": 40,
        "screen_status": "Locked",
        "accessibility_profile": "Women",
        "gps_latitude": 17.385044,
        "gps_longitude": 78.486671,
    }
    payload.update(overrides)
    return payload


def test_root_health(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["message"] == "GuardianAI Backend Running Successfully"


def test_predict_valid_request(client):
    resp = client.post("/predict", json=_valid_payload())
    assert resp.status_code == 200
    body = resp.json()
    assert body["risk_level"] == "Emergency"
    assert "confidence_score" in body
    assert "reasons" in body


def test_predict_generates_alert_on_high_confidence(client):
    # audio distress pushes confidence over the alert threshold (>= 90)
    resp = client.post("/predict", json=_valid_payload(audio_alert_score=100))
    assert resp.status_code == 200
    body = resp.json()
    assert "alert" in body
    assert body["alert"]["google_maps_link"].endswith("17.385044,78.486671")


def test_predict_missing_required_field_returns_422(client):
    resp = client.post("/predict", json={"accelerometer": 50})
    assert resp.status_code == 422


def test_predict_out_of_range_returns_422(client):
    resp = client.post("/predict", json=_valid_payload(accelerometer=500))
    assert resp.status_code == 422


def test_notify_missing_alert_id_returns_422(client):
    resp = client.post("/notify", json={})
    assert resp.status_code == 422


def test_notify_unknown_alert_id_returns_not_found(client):
    resp = client.post("/notify", json={"alert_id": "does-not-exist"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is False
    assert body["error"] == "Alert not found"


def test_notify_uses_contacts_from_request(client):
    # Generate a real alert to get a valid alert_id.
    predict = client.post("/predict", json=_valid_payload(audio_alert_score=100))
    alert_id = predict.json()["alert"]["id"]

    resp = client.post(
        "/notify",
        json={
            "alert_id": alert_id,
            "contacts": [
                {"name": "Mom", "phone_number": "+15551234567", "relationship": "Parent"},
                {"name": "Dad", "phone_number": "+15559876543"},
            ],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    # Contacts passed in the request are used even though the server-side store is empty.
    assert body["success"] is True
    assert body["total_contacts"] == 2
    names = {n["contact_name"] for n in body["notifications"]}
    assert names == {"Mom", "Dad"}


def test_notify_contact_requires_phone_number(client):
    resp = client.post(
        "/notify",
        json={"alert_id": "x", "contacts": [{"name": "NoPhone"}]},
    )
    assert resp.status_code == 422

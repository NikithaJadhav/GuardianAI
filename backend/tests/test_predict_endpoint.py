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

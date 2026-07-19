from app.services.emergency_engine import emergency_engine


def test_normal_conditions_return_low_confidence():
    result = emergency_engine.analyze({
        "accelerometer": 0,
        "gyroscope": 0,
        "gps_speed": 30,
        "inactivity_time": 0,
        "screen_status": "Active",
    })
    assert result["confidence"] == 0
    assert result["risk_level"] == "Normal"
    assert result["risk_emoji"] == "🟢"


def test_critical_conditions_flag_emergency():
    result = emergency_engine.analyze({
        "accelerometer": 95,
        "gyroscope": 90,
        "gps_speed": 130,
        "inactivity_time": 40,
        "screen_status": "Locked",
    })
    assert result["risk_level"] == "Emergency"
    assert result["confidence"] >= 75
    assert result["reasons"]


def test_confidence_capped_at_100():
    result = emergency_engine.analyze({
        "accelerometer": 100,
        "gyroscope": 100,
        "gps_speed": 200,
        "inactivity_time": 120,
        "screen_status": "Locked",
        "audio_alert_score": 100,
        "heart_rate": 200,
    })
    assert result["confidence"] <= 100


def test_supports_new_field_names():
    result = emergency_engine.analyze({
        "impact_intensity": 95,
        "motion_change": 90,
        "speed": 10,
        "inactivity_duration": 40,
        "screen_status": "Locked",
    })
    assert result["confidence"] > 0

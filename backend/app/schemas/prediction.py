"""
Prediction Schemas

Pydantic schemas for the /predict and /notify request payloads.
"""

from pydantic import BaseModel, Field
from typing import Optional


class PredictionRequest(BaseModel):
    """Request payload for the emergency detection /predict endpoint."""
    accelerometer: float = Field(..., ge=0, le=100, description="Accelerometer reading (0-100)")
    gyroscope: float = Field(..., ge=0, le=100, description="Gyroscope reading (0-100)")
    gps_speed: float = Field(..., ge=0, description="GPS speed in km/h")
    inactivity_time: float = Field(..., ge=0, description="Inactivity duration in minutes")
    screen_status: str = Field(..., description="Screen status ('Active' or 'Locked')")
    accessibility_profile: Optional[str] = Field(None, description="Accessibility profile")
    gps_latitude: Optional[float] = Field(None, ge=-90, le=90, description="GPS latitude")
    gps_longitude: Optional[float] = Field(None, ge=-180, le=180, description="GPS longitude")
    user_location: Optional[str] = Field(None, description="User location string")
    user_address: Optional[str] = Field(None, description="Human-readable address")
    audio_alert_score: Optional[float] = Field(None, ge=0, le=100, description="Audio distress score (0-100)")
    heart_rate: Optional[float] = Field(None, ge=0, le=220, description="Heart rate in BPM")


class NotifyRequest(BaseModel):
    """Request payload for the /notify endpoint."""
    alert_id: str = Field(..., min_length=1, description="ID of the alert to notify contacts about")

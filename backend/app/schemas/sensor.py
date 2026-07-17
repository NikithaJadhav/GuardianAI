"""
Sensor Schemas

Pydantic schemas for sensor data validation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class SensorData(BaseModel):
    """
    Real-world sensor data model.
    
    Expected inputs from mobile sensors, wearables, and other devices.
    """
    impact_intensity: float = Field(..., ge=0, le=100, description="Impact intensity from accelerometer (0-100)")
    motion_change: float = Field(..., ge=0, le=100, description="Motion change from gyroscope (0-100)")
    inactivity_duration: float = Field(..., ge=0, description="Inactivity duration in minutes")
    gps_latitude: Optional[float] = Field(None, ge=-90, le=90, description="GPS latitude")
    gps_longitude: Optional[float] = Field(None, ge=-180, le=180, description="GPS longitude")
    speed: Optional[float] = Field(None, ge=0, description="Speed in km/h")
    audio_alert_score: Optional[float] = Field(None, ge=0, le=100, description="Audio alert score (scream detection)")
    heart_rate: Optional[float] = Field(None, ge=0, le=220, description="Heart rate in BPM")
    
    def get_location_string(self) -> Optional[str]:
        """
        Get formatted location string from GPS coordinates.
        
        Returns:
            Google Maps link or None if coordinates not available
        """
        if self.gps_latitude and self.gps_longitude:
            return f"https://www.google.com/maps?q={self.gps_latitude},{self.gps_longitude}"
        return None
    
    def to_legacy_format(self) -> dict:
        """
        Convert to legacy format for compatibility with existing emergency engine.
        
        Returns:
            Dictionary in legacy format
        """
        return {
            'accelerometer': self.impact_intensity,
            'gyroscope': self.motion_change,
            'gps_speed': self.speed or 0,
            'inactivity_time': self.inactivity_duration,
            'screen_status': 'Active',  # Default, can be added as field later
            'user_location': self.get_location_string()
        }

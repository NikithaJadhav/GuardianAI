"""
Alert Schemas

Pydantic schemas for emergency alert request/response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AlertBase(BaseModel):
    """Base alert schema with common fields."""
    emergency_status: str = Field(..., description="Emergency status (e.g., 'CONFIRMED', 'SUSPECTED')")
    confidence_score: float = Field(..., ge=0, le=100, description="Emergency confidence score")
    risk_level: str = Field(..., description="Risk level (Normal, Monitor, Warning, Emergency)")
    reasons: List[str] = Field(..., description="List of reasons for the alert")
    user_location: Optional[str] = Field(None, description="User location (GPS coordinates or address)")
    user_address: Optional[str] = Field(None, description="Human-readable address from reverse geocoding")
    gps_latitude: Optional[float] = Field(None, description="GPS latitude coordinate")
    gps_longitude: Optional[float] = Field(None, description="GPS longitude coordinate")


class AlertCreate(AlertBase):
    """Schema for creating a new alert."""
    pass


class AlertResponse(AlertBase):
    """Schema for alert response."""
    id: str
    timestamp: datetime
    formatted_message: str
    google_maps_link: Optional[str] = Field(None, description="Google Maps link for location")

    class Config:
        from_attributes = True

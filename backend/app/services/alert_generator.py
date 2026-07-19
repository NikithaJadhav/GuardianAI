"""
Alert Generator Service

Service for automatically generating emergency alerts based on confidence scores.
"""

from typing import Dict, Optional
from app.models.alert import alert_model
from app.schemas.alert import AlertCreate


class AlertGenerator:
    """
    Emergency alert generator.
    
    Automatically generates alerts when emergency confidence exceeds threshold.
    """
    
    def __init__(self):
        """Initialize the alert generator with default threshold."""
        self.confidence_threshold = 90.0
    
    def should_generate_alert(self, confidence_score: float) -> bool:
        """
        Determine if an alert should be generated based on confidence score.
        
        Args:
            confidence_score: Emergency confidence score (0-100)
            
        Returns:
            True if alert should be generated, False otherwise
        """
        return confidence_score >= self.confidence_threshold
    
    def generate_alert(
        self,
        confidence_score: float,
        risk_level: str,
        reasons: list,
        user_location: Optional[str] = None,
        user_address: Optional[str] = None,
        gps_latitude: Optional[float] = None,
        gps_longitude: Optional[float] = None
    ) -> Optional[dict]:
        """
        Generate an emergency alert.
        
        Args:
            confidence_score: Emergency confidence score (0-100)
            risk_level: Risk level (Normal, Monitor, Warning, Emergency)
            reasons: List of reasons for the alert
            user_location: User's GPS location (optional)
            user_address: Human-readable address from reverse geocoding (optional)
            gps_latitude: GPS latitude coordinate (optional)
            gps_longitude: GPS longitude coordinate (optional)
            
        Returns:
            Generated alert if confidence exceeds threshold, None otherwise
        """
        if not self.should_generate_alert(confidence_score):
            return None
        
        # Determine emergency status
        if confidence_score >= 95:
            emergency_status = "CRITICAL"
        elif confidence_score >= 90:
            emergency_status = "CONFIRMED"
        else:
            emergency_status = "SUSPECTED"
        
        alert_data = {
            "emergency_status": emergency_status,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "reasons": reasons,
            "user_location": user_location,
            "user_address": user_address,
            "gps_latitude": gps_latitude,
            "gps_longitude": gps_longitude
        }
        
        alert = alert_model.create(alert_data)
        return alert
    
    def set_threshold(self, threshold: float):
        """
        Set the confidence threshold for alert generation.
        
        Args:
            threshold: New confidence threshold (0-100)
        """
        if 0 <= threshold <= 100:
            self.confidence_threshold = threshold
        else:
            raise ValueError("Threshold must be between 0 and 100")


# Singleton instance
alert_generator = AlertGenerator()

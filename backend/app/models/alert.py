"""
Alert Model

In-memory storage for emergency alerts.
Will be replaced with Firebase when database is integrated.
"""

from typing import List, Dict, Optional
from datetime import datetime
import uuid


class AlertModel:
    """
    In-memory alert storage model.
    Simulates database operations for emergency alerts.
    """
    
    def __init__(self):
        """Initialize in-memory alert storage."""
        self._alerts: Dict[str, dict] = {}
    
    def create(self, alert_data: dict) -> dict:
        """
        Create a new alert.
        
        Args:
            alert_data: Dictionary containing alert information
            
        Returns:
            Created alert with ID and timestamp
        """
        alert_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # Generate formatted message
        formatted_message = self._format_alert_message(alert_data)
        
        # Generate Google Maps link if coordinates available
        google_maps_link = None
        if alert_data.get("gps_latitude") and alert_data.get("gps_longitude"):
            google_maps_link = f"https://maps.google.com/?q={alert_data['gps_latitude']},{alert_data['gps_longitude']}"
        
        alert = {
            "id": alert_id,
            "emergency_status": alert_data["emergency_status"],
            "confidence_score": alert_data["confidence_score"],
            "risk_level": alert_data["risk_level"],
            "reasons": alert_data["reasons"],
            "user_location": alert_data.get("user_location"),
            "user_address": alert_data.get("user_address"),
            "gps_latitude": alert_data.get("gps_latitude"),
            "gps_longitude": alert_data.get("gps_longitude"),
            "timestamp": now,
            "formatted_message": formatted_message,
            "google_maps_link": google_maps_link
        }
        
        self._alerts[alert_id] = alert
        return alert
    
    def _format_alert_message(self, alert_data: dict) -> str:
        """
        Format alert data into a human-readable message.
        
        Args:
            alert_data: Dictionary containing alert information
            
        Returns:
            Formatted alert message
        """
        confidence = alert_data["confidence_score"]
        risk_level = alert_data["risk_level"]
        reasons = alert_data["reasons"]
        location = alert_data.get("user_location", "Location not available")
        address = alert_data.get("user_address", "Address not available")
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        date = datetime.utcnow().strftime("%Y-%m-%d")
        time = datetime.utcnow().strftime("%H:%M:%S UTC")
        
        # Get GPS coordinates
        gps_latitude = alert_data.get("gps_latitude")
        gps_longitude = alert_data.get("gps_longitude")
        
        # Generate Google Maps link
        google_maps_link = None
        if gps_latitude and gps_longitude:
            google_maps_link = f"https://maps.google.com/?q={gps_latitude},{gps_longitude}"
        
        message = f"""🚨 GuardianAI Emergency Alert

Emergency Detected

Risk Level:
{risk_level.upper()}

Confidence Score:
{confidence}%

Reasons:
"""
        for reason in reasons:
            message += f"- {reason}\n"
        
        message += f"""
Current Date:
{date}

Current Time:
{time}

Live GPS Coordinates:
"""
        if gps_latitude and gps_longitude:
            message += f"Latitude: {gps_latitude}\n"
            message += f"Longitude: {gps_longitude}\n"
        else:
            message += "Location not available\n"
        
        message += f"""
Location:
{address}

"""
        if google_maps_link:
            message += f"Google Maps Link:\n{google_maps_link}\n"
        
        return message
    
    def get_all(self) -> List[dict]:
        """
        Get all alerts.
        
        Returns:
            List of all alerts
        """
        return list(self._alerts.values())
    
    def get_by_id(self, alert_id: str) -> Optional[dict]:
        """
        Get an alert by ID.
        
        Args:
            alert_id: Alert ID
            
        Returns:
            Alert if found, None otherwise
        """
        return self._alerts.get(alert_id)
    
    def get_recent(self, limit: int = 10) -> List[dict]:
        """
        Get recent alerts.
        
        Args:
            limit: Maximum number of alerts to return
            
        Returns:
            List of recent alerts sorted by timestamp
        """
        alerts = list(self._alerts.values())
        alerts.sort(key=lambda x: x["timestamp"], reverse=True)
        return alerts[:limit]


# Singleton instance
alert_model = AlertModel()

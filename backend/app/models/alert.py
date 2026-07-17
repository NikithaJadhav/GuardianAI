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
        
        alert = {
            "id": alert_id,
            "emergency_status": alert_data["emergency_status"],
            "confidence_score": alert_data["confidence_score"],
            "risk_level": alert_data["risk_level"],
            "reasons": alert_data["reasons"],
            "user_location": alert_data.get("user_location"),
            "timestamp": now,
            "formatted_message": formatted_message
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
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        message = f"""🚨 GuardianAI Emergency Alert

Possible emergency detected.

Risk Level:
{risk_level.upper()}

Confidence:
{confidence}%

Reasons:
"""
        for reason in reasons:
            message += f"- {reason}\n"
        
        message += f"""
Location:
{location}

Time:
{timestamp}
"""
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

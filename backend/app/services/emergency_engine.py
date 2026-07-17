"""
Emergency Intelligence Engine

Rule-based decision engine for emergency detection.
Analyzes sensor data to calculate emergency confidence scores and risk levels.
"""

from typing import Dict, List, Tuple
from enum import Enum


class RiskLevel(Enum):
    """Risk level enumeration"""
    NORMAL = "Normal"
    MONITOR = "Monitor"
    WARNING = "Warning"
    EMERGENCY = "Emergency"


class EmergencyEngine:
    """
    Rule-based emergency decision engine.
    
    Analyzes multiple factors to determine emergency likelihood:
    - Impact intensity (accelerometer)
    - Motion change (gyroscope)
    - Inactivity duration
    - Speed variation
    - Location stability
    """
    
    def __init__(self):
        """Initialize the emergency engine with default thresholds."""
        self.thresholds = {
            # Accelerometer thresholds (0-100 scale)
            'accelerometer_high': 70,
            'accelerometer_critical': 85,
            
            # Gyroscope thresholds (0-100 scale)
            'gyroscope_high': 65,
            'gyroscope_critical': 80,
            
            # GPS speed thresholds (km/h)
            'speed_high': 80,
            'speed_critical': 120,
            
            # Inactivity time thresholds (minutes)
            'inactivity_warning': 15,
            'inactivity_critical': 30,
            
            # Screen locked indicates potential immobility
            'screen_locked_risk': True
        }
    
    def analyze_impact_intensity(self, accelerometer: float) -> Tuple[float, str]:
        """
        Analyze impact intensity from accelerometer data.
        
        Args:
            accelerometer: Accelerometer reading (0-100)
            
        Returns:
            Tuple of (score, reason)
        """
        if accelerometer >= self.thresholds['accelerometer_critical']:
            return 30, "Critical impact intensity detected"
        elif accelerometer >= self.thresholds['accelerometer_high']:
            return 20, "High impact intensity detected"
        elif accelerometer >= 40:
            return 10, "Moderate impact intensity detected"
        return 0, ""
    
    def analyze_motion_change(self, gyroscope: float) -> Tuple[float, str]:
        """
        Analyze motion change from gyroscope data.
        
        Args:
            gyroscope: Gyroscope reading (0-100)
            
        Returns:
            Tuple of (score, reason)
        """
        if gyroscope >= self.thresholds['gyroscope_critical']:
            return 25, "Sudden violent motion detected"
        elif gyroscope >= self.thresholds['gyroscope_high']:
            return 15, "Abnormal motion pattern detected"
        elif gyroscope >= 40:
            return 8, "Elevated motion change detected"
        return 0, ""
    
    def analyze_inactivity_duration(self, inactivity_time: float) -> Tuple[float, str]:
        """
        Analyze inactivity duration.
        
        Args:
            inactivity_time: Time inactive in minutes
            
        Returns:
            Tuple of (score, reason)
        """
        if inactivity_time >= self.thresholds['inactivity_critical']:
            return 25, "Extended inactivity detected (potential unconsciousness)"
        elif inactivity_time >= self.thresholds['inactivity_warning']:
            return 15, "Prolonged inactivity detected"
        elif inactivity_time >= 5:
            return 5, "Moderate inactivity detected"
        return 0, ""
    
    def analyze_speed_variation(self, gps_speed: float) -> Tuple[float, str]:
        """
        Analyze speed variation from GPS data.
        
        Args:
            gps_speed: GPS speed in km/h
            
        Returns:
            Tuple of (score, reason)
        """
        if gps_speed >= self.thresholds['speed_critical']:
            return 20, "Dangerously high speed detected"
        elif gps_speed >= self.thresholds['speed_high']:
            return 12, "High speed detected"
        elif gps_speed >= 40:
            return 5, "Elevated speed detected"
        elif gps_speed == 0:
            # Zero speed with other indicators could mean stopped suddenly
            return 3, "Vehicle stopped abruptly"
        return 0, ""
    
    def analyze_location_stability(self, screen_status: str) -> Tuple[float, str]:
        """
        Analyze location stability based on screen status.
        
        Args:
            screen_status: Screen status ('Active' or 'Locked')
            
        Returns:
            Tuple of (score, reason)
        """
        if screen_status == 'Locked':
            return 5, "Device locked (potential immobility)"
        return 0, ""
    
    def calculate_risk_level(self, confidence_score: float) -> RiskLevel:
        """
        Determine risk level based on confidence score.
        
        Args:
            confidence_score: Emergency confidence score (0-100)
            
        Returns:
            RiskLevel enum value
        """
        if confidence_score >= 75:
            return RiskLevel.EMERGENCY
        elif confidence_score >= 50:
            return RiskLevel.WARNING
        elif confidence_score >= 25:
            return RiskLevel.MONITOR
        return RiskLevel.NORMAL
    
    def get_risk_emoji(self, risk_level: RiskLevel) -> str:
        """
        Get emoji for risk level.
        
        Args:
            risk_level: RiskLevel enum value
            
        Returns:
            Emoji string
        """
        emoji_map = {
            RiskLevel.NORMAL: "🟢",
            RiskLevel.MONITOR: "🟡",
            RiskLevel.WARNING: "🟠",
            RiskLevel.EMERGENCY: "🔴"
        }
        return emoji_map.get(risk_level, "🟢")
    
    def analyze(self, data: Dict) -> Dict:
        """
        Perform comprehensive emergency analysis.
        
        Args:
            data: Dictionary containing sensor data:
                - accelerometer: float (0-100)
                - gyroscope: float (0-100)
                - gps_speed: float (km/h)
                - inactivity_time: float (minutes)
                - screen_status: str ('Active' or 'Locked')
                - accessibility_profile: str (optional)
                
        Returns:
            Dictionary with analysis results:
                - confidence: float (0-100)
                - risk_level: str
                - risk_emoji: str
                - reasons: List[str]
        """
        # Extract sensor data with safe defaults
        accelerometer = float(data.get('accelerometer', 0))
        gyroscope = float(data.get('gyroscope', 0))
        gps_speed = float(data.get('gps_speed', 0))
        inactivity_time = float(data.get('inactivity_time', 0))
        screen_status = data.get('screen_status', 'Active')
        
        # Analyze each factor
        reasons = []
        total_score = 0
        
        # Impact intensity
        impact_score, impact_reason = self.analyze_impact_intensity(accelerometer)
        total_score += impact_score
        if impact_reason:
            reasons.append(impact_reason)
        
        # Motion change
        motion_score, motion_reason = self.analyze_motion_change(gyroscope)
        total_score += motion_score
        if motion_reason:
            reasons.append(motion_reason)
        
        # Inactivity duration
        inactivity_score, inactivity_reason = self.analyze_inactivity_duration(inactivity_time)
        total_score += inactivity_score
        if inactivity_reason:
            reasons.append(inactivity_reason)
        
        # Speed variation
        speed_score, speed_reason = self.analyze_speed_variation(gps_speed)
        total_score += speed_score
        if speed_reason:
            reasons.append(speed_reason)
        
        # Location stability
        location_score, location_reason = self.analyze_location_stability(screen_status)
        total_score += location_score
        if location_reason:
            reasons.append(location_reason)
        
        # Cap confidence score at 100
        confidence = min(100, total_score)
        
        # Determine risk level
        risk_level = self.calculate_risk_level(confidence)
        risk_emoji = self.get_risk_emoji(risk_level)
        
        # If no reasons but score > 0, add generic reason
        if confidence > 0 and not reasons:
            reasons.append("Multiple sensor indicators detected")
        
        return {
            'confidence': round(confidence, 2),
            'risk_level': risk_level.value,
            'risk_emoji': risk_emoji,
            'reasons': reasons
        }


# Singleton instance
emergency_engine = EmergencyEngine()

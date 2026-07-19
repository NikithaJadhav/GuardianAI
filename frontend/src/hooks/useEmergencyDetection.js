import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for contextual emergency detection
 * Combines multiple sensor signals to calculate emergency confidence score
 */
export const useEmergencyDetection = (sensorData, audioData, enabled = false) => {
  const [emergencyScore, setEmergencyScore] = useState({
    confidence: 0,
    riskLevel: 'Normal',
    reasons: [],
    lastCalculated: null
  });

  const [isEmergencyDetected, setIsEmergencyDetected] = useState(false);
  const scoreHistoryRef = useRef([]);

  // Calculate emergency confidence based on multiple signals
  const calculateEmergencyScore = useCallback(() => {
    if (!enabled) return;

    let totalScore = 0;
    const reasons = [];

    // 1. Accelerometer analysis (impact detection)
    const accMagnitude = sensorData.accelerometer.magnitude;
    if (accMagnitude > 20) {
      const impactScore = Math.min(30, (accMagnitude - 20) * 1.5);
      totalScore += impactScore;
      reasons.push(`Critical impact detected (${accMagnitude.toFixed(1)} m/s²)`);
    } else if (accMagnitude > 15) {
      totalScore += 15;
      reasons.push(`High impact detected (${accMagnitude.toFixed(1)} m/s²)`);
    }

    // 2. Gyroscope analysis (violent motion/rotation)
    const gyroMagnitude = sensorData.gyroscope.magnitude;
    if (gyroMagnitude > 50) {
      const rotationScore = Math.min(25, (gyroMagnitude - 50) * 0.5);
      totalScore += rotationScore;
      reasons.push(`Violent device rotation detected`);
    } else if (gyroMagnitude > 30) {
      totalScore += 10;
      reasons.push(`Abnormal motion pattern detected`);
    }

    // 3. GPS speed analysis
    const gpsSpeed = sensorData.gps.speed;
    if (gpsSpeed > 100) {
      totalScore += 20;
      reasons.push(`Dangerously high speed detected (${gpsSpeed.toFixed(1)} km/h)`);
    } else if (gpsSpeed > 80) {
      totalScore += 12;
      reasons.push(`High speed detected (${gpsSpeed.toFixed(1)} km/h)`);
    } else if (gpsSpeed === 0 && accMagnitude > 10) {
      totalScore += 8;
      reasons.push(`Sudden stop detected with impact`);
    }

    // 4. Inactivity analysis
    const inactivityDuration = sensorData.activity.inactivityDuration;
    if (inactivityDuration > 30) {
      totalScore += 25;
      reasons.push(`Extended inactivity (${inactivityDuration.toFixed(0)}s) - possible unconsciousness`);
    } else if (inactivityDuration > 15) {
      totalScore += 15;
      reasons.push(`Prolonged inactivity (${inactivityDuration.toFixed(0)}s)`);
    }

    // 5. Audio distress detection
    if (audioData.distressDetected) {
      const audioScore = Math.min(20, audioData.currentLevel * 0.3);
      totalScore += audioScore;
      reasons.push(`Loud distress sound detected (${audioData.currentLevel.toFixed(0)}% volume)`);
    }

    // 6. Sudden GPS stop (if was moving)
    if (gpsSpeed === 0 && inactivityDuration > 10 && accMagnitude > 5) {
      totalScore += 10;
      reasons.push(`GPS suddenly stopped after movement`);
    }

    // 7. Multiple distress signals
    if (audioData.distressCount > 3) {
      totalScore += 10;
      reasons.push(`Repeated distress sounds detected`);
    }

    // Cap at 100
    totalScore = Math.min(100, totalScore);

    // Determine risk level
    let riskLevel = 'Normal';
    if (totalScore >= 75) riskLevel = 'Emergency';
    else if (totalScore >= 50) riskLevel = 'Warning';
    else if (totalScore >= 25) riskLevel = 'Monitor';

    // Smooth the score using history
    scoreHistoryRef.current.push(totalScore);
    if (scoreHistoryRef.current.length > 5) {
      scoreHistoryRef.current.shift();
    }
    const smoothedScore = scoreHistoryRef.current.reduce((a, b) => a + b, 0) / scoreHistoryRef.current.length;

    setEmergencyScore({
      confidence: Math.round(smoothedScore),
      riskLevel,
      reasons: reasons.slice(0, 5), // Limit to top 5 reasons
      lastCalculated: new Date().toISOString()
    });

    setIsEmergencyDetected(smoothedScore >= 90);
  }, [sensorData, audioData, enabled]);

  // Calculate score periodically
  const calculateIntervalRef = useRef(null);

  const startDetection = useCallback(() => {
    if (calculateIntervalRef.current) {
      clearInterval(calculateIntervalRef.current);
    }
    calculateIntervalRef.current = setInterval(calculateEmergencyScore, 1000);
  }, [calculateEmergencyScore]);

  const stopDetection = useCallback(() => {
    if (calculateIntervalRef.current) {
      clearInterval(calculateIntervalRef.current);
      calculateIntervalRef.current = null;
    }
  }, []);

  // Auto-start/stop based on enabled state
  const startDetectionRef = useRef(startDetection);
  const stopDetectionRef = useRef(stopDetection);

  startDetectionRef.current = startDetection;
  stopDetectionRef.current = stopDetection;

  return { 
    emergencyScore, 
    isEmergencyDetected, 
    startDetection, 
    stopDetection 
  };
};

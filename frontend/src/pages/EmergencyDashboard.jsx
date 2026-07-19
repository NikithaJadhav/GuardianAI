import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getUserContacts } from '../firebase/firebaseService';
import { useSensorMonitoring } from '../hooks/useSensorMonitoring';
import { useAudioMonitoring } from '../hooks/useAudioMonitoring';
import { useEmergencyDetection } from '../hooks/useEmergencyDetection';
import EmergencyCountdown from '../components/EmergencyCountdown';
import './EmergencyDashboard.css';

const EmergencyDashboard = ({ navigateTo }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState('manual'); // 'manual' or 'automatic'
  
  const [formData, setFormData] = useState({
    accelerometer: 50,
    gyroscope: 50,
    gps_speed: 50,
    inactivity_time: 30,
    screen_status: 'Active',
    accessibility_profile: 'Women'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);
  
  // Automatic monitoring state
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  
  // Custom hooks
  const { sensorData, sensorStatus } = useSensorMonitoring(monitoringEnabled);
  const { audioData, audioStatus } = useAudioMonitoring(audioEnabled);
  const { emergencyScore, isEmergencyDetected, startDetection, stopDetection } = 
    useEmergencyDetection(sensorData, audioData, monitoringEnabled);
  
  const countdownIntervalRef = useRef(null);
  const emergencyDataRef = useRef(null);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle monitoring mode
  const toggleMonitoring = useCallback(() => {
    if (mode === 'manual') {
      setMode('automatic');
      setMonitoringEnabled(true);
      setAudioEnabled(true);
      startDetection();
    } else {
      setMode('manual');
      setMonitoringEnabled(false);
      setAudioEnabled(false);
      stopDetection();
    }
  }, [mode, startDetection, stopDetection]);

  // Handle emergency countdown
  useEffect(() => {
    if (isEmergencyDetected && !countdownVisible) {
      emergencyDataRef.current = {
        sensorData,
        audioData,
        emergencyScore
      };
      setCountdownVisible(true);
      setCountdownValue(10);
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            triggerAutomaticEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isEmergencyDetected, countdownVisible, sensorData, audioData, emergencyScore]);

  // Cancel countdown (user confirms they're safe)
  const handleCancelCountdown = useCallback(() => {
    setCountdownVisible(false);
    setCountdownValue(10);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    // Reset emergency detection temporarily
    setTimeout(() => {
      setMonitoringEnabled(true);
    }, 30000); // 30 second cooldown
  }, []);

  // Load the user's saved emergency contacts and send the alert to them.
  // These contacts live in Firestore (per user), so we forward them to the
  // backend /notify endpoint which dispatches SMS to each.
  const dispatchNotification = useCallback(async (alertId) => {
    setNotificationStatus({ status: 'pending', alertId });

    let contacts = [];
    if (user) {
      const res = await getUserContacts(user.uid);
      if (res.success) {
        contacts = res.data;
      }
    }

    const payloadContacts = contacts.map((c) => ({
      name: c.name,
      phone_number: c.phone_number,
      email: c.email || null,
      relationship: c.relationship || null,
    }));

    const notifyResponse = await apiService.notifyContacts({
      alert_id: alertId,
      contacts: payloadContacts,
    });

    const data = notifyResponse.data || {};
    let status;
    if (!notifyResponse.success) {
      status = 'failed';
    } else if (data.success && data.sent > 0) {
      status = 'sent';
    } else if (payloadContacts.length === 0 || data.error === 'No emergency contacts registered') {
      status = 'no_contacts';
    } else {
      status = 'skipped';
    }

    setNotificationStatus({ status, ...data });
  }, [user]);

  // Trigger automatic emergency response
  const triggerAutomaticEmergency = useCallback(async () => {
    setCountdownVisible(false);
    
    const data = emergencyDataRef.current;
    if (!data) return;

    // Get location
    let locationData = null;
    try {
      locationData = await getCurrentLocation();
      if (locationData) {
        const address = await reverseGeocode(locationData.latitude, locationData.longitude);
        locationData.address = address;
      }
    } catch (err) {
      console.warn('Location fetch failed:', err);
    }

    // Prepare request data from sensor data
    const requestData = {
      accelerometer: Math.min(100, data.sensorData.accelerometer.magnitude * 5),
      gyroscope: Math.min(100, data.sensorData.gyroscope.magnitude * 2),
      gps_speed: data.sensorData.gps.speed,
      inactivity_time: data.sensorData.activity.inactivityDuration / 60,
      screen_status: 'Locked',
      accessibility_profile: 'Women'
    };

    if (locationData) {
      requestData.gps_latitude = locationData.latitude;
      requestData.gps_longitude = locationData.longitude;
      requestData.user_location = `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
      if (locationData.address) {
        requestData.user_address = locationData.address;
      }
    }

    const response = await apiService.predictEmergency(requestData);

    if (response.success) {
      setResult(response.data);
      
      if (response.data.alert) {
        await dispatchNotification(response.data.alert.id);
      }
    }
  }, [dispatchNotification]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(locationData);
          setLocationError(null);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setLocationError(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const getGoogleMapsUrl = (lat, lng) => {
    return `https://maps.google.com/?q=${lat},${lng}`;
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || data.address?.city || data.address?.town || data.address?.village || 'Location not available';
      }
      return null;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return null;
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setNotificationStatus(null);

    // Get current location
    let locationData = null;
    try {
      locationData = await getCurrentLocation();
      
      // Get human-readable address if location is available
      if (locationData) {
        const address = await reverseGeocode(locationData.latitude, locationData.longitude);
        locationData.address = address;
      }
    } catch (err) {
      console.warn('Location fetch failed, continuing without location:', err);
    }

    const requestData = {
      accelerometer: formData.accelerometer,
      gyroscope: formData.gyroscope,
      gps_speed: formData.gps_speed,
      inactivity_time: formData.inactivity_time,
      screen_status: formData.screen_status,
      accessibility_profile: formData.accessibility_profile
    };

    // Add location data if available
    if (locationData) {
      requestData.gps_latitude = locationData.latitude;
      requestData.gps_longitude = locationData.longitude;
      requestData.user_location = `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
      if (locationData.address) {
        requestData.user_address = locationData.address;
      }
    }

    const response = await apiService.predictEmergency(requestData);

    setLoading(false);

    if (response.success) {
      setResult(response.data);
      
      // If alert was generated, notify the user's saved emergency contacts
      if (response.data.alert) {
        await dispatchNotification(response.data.alert.id);
      }
    } else {
      setError(response.error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Normal': return '#22c55e';
      case 'Monitor': return '#eab308';
      case 'Warning': return '#f97316';
      case 'Emergency': return '#ef4444';
      default: return '#22c55e';
    }
  };

  return (
    <div className="emergency-dashboard">
      <div className="dashboard-container">
        <button 
          className="back-button"
          onClick={() => navigateTo('home')}
        >
          ← Back to Home
        </button>
        <div className="dashboard-header">
          <h1 className="dashboard-title">Emergency Detection Dashboard</h1>
          <p className="dashboard-subtitle">Monitor sensor data and detect emergency situations</p>
          
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button 
              className={`mode-button ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => { if (mode === 'automatic') toggleMonitoring(); }}
            >
              Manual Mode
            </button>
            <button 
              className={`mode-button ${mode === 'automatic' ? 'active' : ''}`}
              onClick={toggleMonitoring}
            >
              Automatic Mode
            </button>
          </div>
        </div>

        {/* Live Monitoring Cards (Automatic Mode) */}
        {mode === 'automatic' && (
          <div className="live-monitoring-section">
            <div className="monitoring-grid">
              {/* Microphone Status */}
              <div className="monitoring-card">
                <div className="monitoring-icon">🎤</div>
                <h3>Microphone</h3>
                <div className={`status-badge ${audioStatus}`}>
                  {audioStatus === 'active' ? 'Active' : audioStatus === 'error' ? 'Error' : 'Inactive'}
                </div>
                {audioStatus === 'active' && (
                  <div className="monitoring-value">
                    <span className="value-label">Sound Level:</span>
                    <span className="value-number">{audioData.currentLevel.toFixed(0)}%</span>
                  </div>
                )}
                {audioData.distressDetected && (
                  <div className="distress-indicator">⚠️ Distress Detected</div>
                )}
              </div>

              {/* Motion Status */}
              <div className="monitoring-card">
                <div className="monitoring-icon">📱</div>
                <h3>Motion</h3>
                <div className={`status-badge ${sensorStatus.accelerometer}`}>
                  {sensorStatus.accelerometer === 'active' ? 'Active' : 'Inactive'}
                </div>
                {sensorStatus.accelerometer === 'active' && (
                  <div className="monitoring-value">
                    <span className="value-label">Movement:</span>
                    <span className="value-number">{sensorData.accelerometer.magnitude.toFixed(1)} m/s²</span>
                  </div>
                )}
              </div>

              {/* GPS Status */}
              <div className="monitoring-card">
                <div className="monitoring-icon">📍</div>
                <h3>GPS</h3>
                <div className={`status-badge ${sensorStatus.gps}`}>
                  {sensorStatus.gps === 'active' ? 'Active' : sensorStatus.gps === 'error' ? 'Error' : 'Inactive'}
                </div>
                {sensorStatus.gps === 'active' && (
                  <div className="monitoring-value">
                    <span className="value-label">Speed:</span>
                    <span className="value-number">{sensorData.gps.speed.toFixed(1)} km/h</span>
                  </div>
                )}
              </div>

              {/* Activity Status */}
              <div className="monitoring-card">
                <div className="monitoring-icon">👤</div>
                <h3>Activity</h3>
                <div className={`status-badge ${sensorData.activity.isMoving ? 'active' : 'inactive'}`}>
                  {sensorData.activity.isMoving ? 'Moving' : 'Inactive'}
                </div>
                <div className="monitoring-value">
                  <span className="value-label">Inactivity:</span>
                  <span className="value-number">{sensorData.activity.inactivityDuration.toFixed(0)}s</span>
                </div>
              </div>

              {/* Emergency Score */}
              <div className="monitoring-card emergency-card">
                <div className="monitoring-icon">🚨</div>
                <h3>Emergency Score</h3>
                <div className="emergency-score-display">
                  <span className="score-number">{emergencyScore.confidence}%</span>
                  <span className={`score-risk ${emergencyScore.riskLevel.toLowerCase()}`}>
                    {emergencyScore.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Mode Inputs */}
        {mode === 'manual' && (
          <div className="dashboard-content">
            <div className="input-section">
              <div className="card sensor-card">
                <h2 className="card-title">Sensor Inputs</h2>
                
                <div className="input-group">
                  <label className="input-label">
                    Accelerometer
                    <span className="input-value">{formData.accelerometer}</span>
                  </label>
                  <input
                    type="range"
                    name="accelerometer"
                    min="0"
                    max="100"
                    value={formData.accelerometer}
                    onChange={handleSliderChange}
                    className="slider"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Gyroscope
                    <span className="input-value">{formData.gyroscope}</span>
                  </label>
                  <input
                    type="range"
                    name="gyroscope"
                    min="0"
                    max="100"
                    value={formData.gyroscope}
                    onChange={handleSliderChange}
                    className="slider"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    GPS Speed (km/h)
                    <span className="input-value">{formData.gps_speed}</span>
                  </label>
                  <input
                    type="range"
                    name="gps_speed"
                    min="0"
                    max="150"
                    value={formData.gps_speed}
                    onChange={handleSliderChange}
                    className="slider"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Inactivity Time (min)
                    <span className="input-value">{formData.inactivity_time}</span>
                  </label>
                  <input
                    type="range"
                    name="inactivity_time"
                    min="0"
                    max="60"
                    value={formData.inactivity_time}
                    onChange={handleSliderChange}
                    className="slider"
                  />
                </div>
              </div>

              <div className="card profile-card">
                <h2 className="card-title">Profile Settings</h2>
                
                <div className="input-group">
                  <label className="input-label">Screen Status</label>
                  <select
                    name="screen_status"
                    value={formData.screen_status}
                    onChange={handleSelectChange}
                    className="select-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Locked">Locked</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Accessibility Profile</label>
                  <select
                    name="accessibility_profile"
                    value={formData.accessibility_profile}
                    onChange={handleSelectChange}
                    className="select-input"
                  >
                    <option value="Women">Women</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Construction Worker">Construction Worker</option>
                    <option value="Hearing Disability">Hearing Disability</option>
                    <option value="Speech Disability">Speech Disability</option>
                    <option value="Road Accident Victim">Road Accident Victim</option>
                  </select>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`analyze-button ${loading ? 'loading' : ''}`}
                >
                  {loading ? 'Analyzing...' : 'Analyze Emergency'}
                </button>

                {locationError && (
                  <div className="location-warning">
                    ⚠️ {locationError}
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section (both modes) */}
        {result && (
          <div className="result-section fade-in">
            <div className="card result-card">
              <h2 className="card-title">Emergency Analysis Result</h2>
              
              <div className="confidence-container">
                <div className="circular-progress">
                  <svg className="progress-ring" width="200" height="200">
                    <circle
                      className="progress-ring-circle-bg"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="transparent"
                      r="80"
                      cx="100"
                      cy="100"
                    />
                    <circle
                      className="progress-ring-circle"
                      stroke={getRiskColor(result.risk_level)}
                      strokeWidth="12"
                      fill="transparent"
                      r="80"
                      cx="100"
                      cy="100"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 80}`,
                        strokeDashoffset: `${2 * Math.PI * 80 * (1 - result.confidence_score / 100)}`,
                        transition: 'stroke-dashoffset 1s ease-in-out'
                      }}
                    />
                  </svg>
                  <div className="progress-text">
                    <span className="progress-value">{result.confidence_score}%</span>
                    <span className="progress-label">Confidence</span>
                  </div>
                </div>
              </div>

              <div className="risk-level-container">
                <div 
                  className="risk-badge"
                  style={{ backgroundColor: getRiskColor(result.risk_level) }}
                >
                  <span className="risk-emoji">{result.risk_emoji}</span>
                  <span className="risk-text">{result.risk_level}</span>
                </div>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <div className="reasons-container">
                  <h3 className="reasons-title">Analysis Reasons</h3>
                  <ul className="reasons-list">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="reason-item">
                        <span className="reason-bullet">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {location && (
                <div className="location-container">
                  <h3 className="location-title">📍 Current Location</h3>
                  <div className="location-details">
                    <div className="location-coordinate">
                      <span className="coordinate-label">Latitude:</span>
                      <span className="coordinate-value">{location.latitude.toFixed(6)}</span>
                    </div>
                    <div className="location-coordinate">
                      <span className="coordinate-label">Longitude:</span>
                      <span className="coordinate-value">{location.longitude.toFixed(6)}</span>
                    </div>
                    <div className="location-coordinate">
                      <span className="coordinate-label">Accuracy:</span>
                      <span className="coordinate-value">±{location.accuracy.toFixed(0)}m</span>
                    </div>
                    {location.address && (
                      <div className="location-address">
                        <span className="address-label">📍 Address:</span>
                        <span className="address-value">{location.address}</span>
                      </div>
                    )}
                    <a 
                      href={getGoogleMapsUrl(location.latitude, location.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="maps-button"
                    >
                      🗺️ Open in Google Maps
                    </a>
                  </div>
                </div>
              )}

              {result.alert && (
                <div className="alert-container">
                  <h3 className="alert-title">🚨 Emergency Alert Generated</h3>
                  <div className="alert-details">
                    <div className="alert-detail">
                      <span className="alert-label">Status:</span>
                      <span className="alert-value">{result.alert.emergency_status}</span>
                    </div>
                    <div className="alert-detail">
                      <span className="alert-label">Time:</span>
                      <span className="alert-value">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="alert-detail">
                      <span className="alert-label">Alert ID:</span>
                      <span className="alert-value">{result.alert.id}</span>
                    </div>
                  </div>
                </div>
              )}

              {notificationStatus && (
                <div className="notification-container">
                  <h3 className="notification-title">📢 Notification Status</h3>
                  <div className={`notification-status ${notificationStatus.status}`}>
                    {notificationStatus.status === 'pending' && '⏳ Notifying your emergency contacts...'}
                    {notificationStatus.status === 'sent' && `✅ Alert sent to ${notificationStatus.sent} of ${notificationStatus.total_contacts} contact(s)`}
                    {notificationStatus.status === 'no_contacts' && '⚠️ No emergency contacts saved — add contacts to receive alerts'}
                    {notificationStatus.status === 'skipped' && `⚠️ Reached ${notificationStatus.total_contacts} contact(s), but SMS delivery is not configured (Twilio credentials required)`}
                    {notificationStatus.status === 'failed' && '❌ Notification failed'}
                  </div>
                  {notificationStatus.total_contacts > 0 && notificationStatus.status !== 'skipped' && (
                    <div className="notification-details">
                      <span className="notification-detail">Contacts notified: {notificationStatus.sent}/{notificationStatus.total_contacts}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Countdown Modal */}
      <EmergencyCountdown
        isVisible={countdownVisible}
        countdown={countdownValue}
        reasons={emergencyScore.reasons}
        onConfirmSafe={handleCancelCountdown}
        onCancel={handleCancelCountdown}
      />
    </div>
  );
};

export default EmergencyDashboard;

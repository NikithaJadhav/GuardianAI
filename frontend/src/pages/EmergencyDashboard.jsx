import React, { useState } from 'react';
import { apiService } from '../services/api';
import './EmergencyDashboard.css';

const EmergencyDashboard = ({ navigateTo }) => {
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

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await apiService.predictEmergency({
      accelerometer: formData.accelerometer,
      gyroscope: formData.gyroscope,
      gps_speed: formData.gps_speed,
      inactivity_time: formData.inactivity_time,
      screen_status: formData.screen_status,
      accessibility_profile: formData.accessibility_profile
    });

    setLoading(false);

    if (response.success) {
      setResult(response.data);
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
        </div>

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

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </div>

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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;

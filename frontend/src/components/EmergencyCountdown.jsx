import React, { useState, useEffect } from 'react';
import './EmergencyCountdown.css';

const EmergencyCountdown = ({ 
  isVisible, 
  countdown, 
  reasons, 
  onConfirmSafe, 
  onCancel 
}) => {
  const [currentCountdown, setCurrentCountdown] = useState(countdown);

  useEffect(() => {
    setCurrentCountdown(countdown);
  }, [countdown]);

  if (!isVisible) return null;

  return (
    <div className="emergency-countdown-overlay">
      <div className="emergency-countdown-modal">
        <div className="countdown-header">
          <div className="warning-icon">🚨</div>
          <h1 className="countdown-title">Possible Emergency Detected</h1>
        </div>

        <div className="countdown-display">
          <div className="countdown-number">{currentCountdown}</div>
          <div className="countdown-label">Sending emergency alerts in...</div>
        </div>

        {reasons && reasons.length > 0 && (
          <div className="countdown-reasons">
            <h3>Detection Reasons:</h3>
            <ul>
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="countdown-actions">
          <button 
            className="countdown-button safe-button"
            onClick={onConfirmSafe}
          >
            ✓ I'm Safe - Cancel Alert
          </button>
        </div>

        <div className="countdown-footer">
          <p>If you don't respond, emergency contacts will be notified automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCountdown;

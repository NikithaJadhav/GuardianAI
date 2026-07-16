import React from 'react';
import './AccessibilitySection.css';

const AccessibilitySection = () => {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      title: 'Voice Commands',
      description: 'Hands-free operation through natural voice commands for users with mobility challenges.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      title: 'Visual Alerts',
      description: 'High-contrast visual indicators and flashing alerts for hearing-impaired users.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      ),
      title: 'Screen Reader Support',
      description: 'Full WCAG 2.1 AA compliance with optimized screen reader compatibility.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      title: 'Simple Interface',
      description: 'Clean, intuitive design with large touch targets and clear visual hierarchy.'
    }
  ];

  return (
    <section id="accessibility" className="accessibility">
      <div className="accessibility-container">
        <div className="accessibility-header">
          <h2 className="accessibility-title">Accessibility First</h2>
          <p className="accessibility-subtitle">
            Designed to be inclusive and usable by everyone, regardless of ability
          </p>
        </div>
        
        <div className="accessibility-content">
          <div className="accessibility-features">
            {features.map((feature, index) => (
              <div key={index} className="accessibility-feature">
                <div className="accessibility-icon">{feature.icon}</div>
                <h3 className="accessibility-feature-title">{feature.title}</h3>
                <p className="accessibility-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="accessibility-cta">
            <div className="accessibility-cta-content">
              <h3 className="accessibility-cta-title">Committed to Inclusion</h3>
              <p className="accessibility-cta-description">
                GuardianAI is built with accessibility at its core, ensuring everyone can benefit from advanced emergency protection.
              </p>
              <button className="accessibility-cta-button">Learn About Our Standards</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection;

import React from 'react';
import './AccessibilitySection.css';

const AccessibilitySection = () => {
  const profiles = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Women Travelling Alone',
      description: 'Enhanced safety monitoring with route tracking, safe zone alerts, and quick emergency activation for solo travelers.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          <path d="M12 2v4"/>
          <path d="M12 18v4"/>
          <path d="M4.93 4.93l2.83 2.83"/>
          <path d="M16.24 16.24l2.83 2.83"/>
          <path d="M2 12h4"/>
          <path d="M18 12h4"/>
          <path d="M4.93 19.07l2.83-2.83"/>
          <path d="M16.24 7.76l2.83-2.83"/>
        </svg>
      ),
      title: 'Senior Citizens',
      description: 'Fall detection, medication reminders, and health monitoring with simplified one-touch emergency alerts.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Construction Workers',
      description: 'Workplace safety monitoring with hazard detection, equipment tracking, and site-specific emergency protocols.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M4.93 4.93l1.41 1.41"/>
          <path d="M17.66 17.66l1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="M6.34 17.66l-1.41 1.41"/>
          <path d="M19.07 4.93l-1.41 1.41"/>
        </svg>
      ),
      title: 'Persons with Disabilities',
      description: 'Customizable accessibility features including voice control, visual alerts, and adaptive emergency response options.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
          <path d="M5 17H2"/>
          <path d="M22 17h-3"/>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Road Accident Victims',
      description: 'Automatic crash detection with instant location sharing, injury assessment, and emergency service dispatch.'
    }
  ];

  return (
    <section id="accessibility" className="accessibility">
      <div className="accessibility-container">
        <div className="accessibility-header fade-in">
          <h2 className="accessibility-title">Accessibility Profiles</h2>
          <p className="accessibility-subtitle">
            Tailored protection for every user group with specialized safety features
          </p>
        </div>
        
        <div className="profiles-grid">
          {profiles.map((profile, index) => (
            <div key={index} className={`profile-card scale-in stagger-${index + 1}`}>
              <div className="profile-icon">{profile.icon}</div>
              <h3 className="profile-title">{profile.title}</h3>
              <p className="profile-description">{profile.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessibilitySection;

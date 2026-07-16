import React from 'react';
import './AccessibilitySection.css';

const AccessibilitySection = () => {
  const profiles = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/>
          <path d="M16 3l4 4-4 4"/>
          <path d="M20 7H10"/>
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
          <circle cx="12" cy="13" r="2"/>
        </svg>
      ),
      title: 'Senior Citizens',
      description: 'Fall detection, medication reminders, and health monitoring with simplified one-touch emergency alerts.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      title: 'Construction Workers',
      description: 'Workplace safety monitoring with hazard detection, equipment tracking, and site-specific emergency protocols.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
          <path d="M12 3a9 9 0 0 0-9 9v3"/>
          <path d="M12 3a9 9 0 0 1 9 9v3"/>
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
        </svg>
      ),
      title: 'Road Accident Victims',
      description: 'Automatic crash detection with instant location sharing, injury assessment, and emergency service dispatch.'
    }
  ];

  return (
    <section id="accessibility" className="accessibility">
      <div className="accessibility-container">
        <div className="accessibility-header">
          <h2 className="accessibility-title">Accessibility Profiles</h2>
          <p className="accessibility-subtitle">
            Tailored protection for every user group with specialized safety features
          </p>
        </div>
        
        <div className="profiles-grid">
          {profiles.map((profile, index) => (
            <div key={index} className="profile-card">
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

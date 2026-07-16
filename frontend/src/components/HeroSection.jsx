import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">GuardianAI</h1>
          <h2 className="hero-subtitle">AI That Thinks Before It's Too Late.</h2>
          <p className="hero-description">
            GuardianAI proactively detects emergencies using AI, sensor intelligence, 
            and contextual analysis before users can manually request help.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        
        <div className="hero-illustration">
          <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
            {/* Background circles */}
            <circle cx="250" cy="200" r="150" fill="rgba(230, 57, 70, 0.1)"/>
            <circle cx="250" cy="200" r="100" fill="rgba(0, 212, 255, 0.1)"/>
            
            {/* Central shield */}
            <path d="M250 80 L320 120 L320 200 C320 280 250 340 250 340 C250 340 180 280 180 200 L180 120 Z" 
                  fill="#0B1F3A" stroke="#E63946" strokeWidth="3"/>
            
            {/* AI pulse lines */}
            <circle cx="250" cy="180" r="30" stroke="#00D4FF" strokeWidth="2" fill="none" opacity="0.8"/>
            <circle cx="250" cy="180" r="45" stroke="#00D4FF" strokeWidth="2" fill="none" opacity="0.5"/>
            <circle cx="250" cy="180" r="60" stroke="#00D4FF" strokeWidth="2" fill="none" opacity="0.3"/>
            
            {/* Central brain/AI icon */}
            <path d="M250 150 C230 150 220 165 220 180 C220 195 235 210 250 210 C265 210 280 195 280 180 C280 165 270 150 250 150" 
                  fill="#E63946"/>
            <circle cx="240" cy="175" r="5" fill="white"/>
            <circle cx="260" cy="175" r="5" fill="white"/>
            <path d="M245 190 Q250 195 255 190" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Sensor nodes */}
            <circle cx="150" cy="150" r="15" fill="#0B1F3A" stroke="#00D4FF" strokeWidth="2"/>
            <circle cx="350" cy="150" r="15" fill="#0B1F3A" stroke="#00D4FF" strokeWidth="2"/>
            <circle cx="150" cy="250" r="15" fill="#0B1F3A" stroke="#00D4FF" strokeWidth="2"/>
            <circle cx="350" cy="250" r="15" fill="#0B1F3A" stroke="#00D4FF" strokeWidth="2"/>
            
            {/* Connection lines */}
            <line x1="165" y1="150" x2="180" y2="120" stroke="#00D4FF" strokeWidth="2" opacity="0.6"/>
            <line x1="335" y1="150" x2="320" y2="120" stroke="#00D4FF" strokeWidth="2" opacity="0.6"/>
            <line x1="165" y1="250" x2="180" y2="200" stroke="#00D4FF" strokeWidth="2" opacity="0.6"/>
            <line x1="335" y1="250" x2="320" y2="200" stroke="#00D4FF" strokeWidth="2" opacity="0.6"/>
            
            {/* Alert indicators */}
            <path d="M100 100 L110 85 L120 100 Z" fill="#E63946"/>
            <path d="M380 100 L390 85 L400 100 Z" fill="#E63946"/>
            <path d="M100 300 L110 285 L120 300 Z" fill="#E63946"/>
            <path d="M380 300 L390 285 L400 300 Z" fill="#E63946"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

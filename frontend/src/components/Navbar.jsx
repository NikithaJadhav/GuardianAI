import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ navigateTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#E63946" strokeWidth="3" fill="none"/>
            <path d="M20 8 L20 20 L28 28" stroke="#E63946" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="3" fill="#E63946"/>
          </svg>
          <span className="logo-text">GuardianAI</span>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#workflow" className="nav-link">How It Works</a>
          <a href="#accessibility" className="nav-link">Accessibility</a>
          <button 
            className="nav-link nav-button" 
            onClick={() => navigateTo('emergency')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Emergency Dashboard
          </button>
          <button 
            className="nav-link nav-button" 
            onClick={() => navigateTo('contacts')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Emergency Contacts
          </button>
          <a href="#contact" className="nav-link">Contact</a>
          <button className="nav-cta">Get Started</button>
        </div>

        <button 
          className="hamburger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

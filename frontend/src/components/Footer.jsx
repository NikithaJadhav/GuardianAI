import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#E63946" strokeWidth="3" fill="none"/>
                <path d="M20 8 L20 20 L28 28" stroke="#E63946" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" fill="#E63946"/>
              </svg>
              <span className="footer-logo-text">GuardianAI</span>
            </div>
            <p className="footer-tagline">
              AI-powered emergency intelligence system protecting what matters most.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="footer-link-title">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#workflow" className="footer-link">How It Works</a>
              <a href="#accessibility" className="footer-link">Accessibility</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>
            
            <div className="footer-link-group">
              <h4 className="footer-link-title">Company</h4>
              <a href="#" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Press</a>
            </div>
            
            <div className="footer-link-group">
              <h4 className="footer-link-title">Support</h4>
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 GuardianAI. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AIWorkflowSection from '../components/AIWorkflowSection';
import AccessibilitySection from '../components/AccessibilitySection';
import Footer from '../components/Footer';
import { apiService } from '../services/api';
import './Home.css';
import '../styles/animations.css';

const Home = ({ navigateTo }) => {
  const [backendStatus, setBackendStatus] = useState('loading');

  useEffect(() => {
    const checkBackend = async () => {
      const result = await apiService.checkBackendConnection();
      setBackendStatus(result.success ? 'connected' : 'offline');
    };

    checkBackend();

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home">
      <div className={`backend-status ${backendStatus}`}>
        {backendStatus === 'loading' && (
          <div className="status-content">
            <div className="status-spinner"></div>
            <span>Connecting to backend...</span>
          </div>
        )}
        {backendStatus === 'connected' && (
          <div className="status-content">
            <div className="status-icon connected">✓</div>
            <span>Backend Connected Successfully</span>
          </div>
        )}
        {backendStatus === 'offline' && (
          <div className="status-content">
            <div className="status-icon offline">✕</div>
            <span>Backend Offline</span>
          </div>
        )}
      </div>
      <Navbar navigateTo={navigateTo} />
      <HeroSection />
      <FeaturesSection />
      <AIWorkflowSection />
      <AccessibilitySection />
      <Footer />
    </div>
  );
};

export default Home;

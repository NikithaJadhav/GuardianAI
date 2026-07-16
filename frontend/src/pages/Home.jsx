import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AIWorkflowSection from '../components/AIWorkflowSection';
import AccessibilitySection from '../components/AccessibilitySection';
import Footer from '../components/Footer';
import './Home.css';
import '../styles/animations.css';

const Home = () => {
  useEffect(() => {
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
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AIWorkflowSection />
      <AccessibilitySection />
      <Footer />
    </div>
  );
};

export default Home;

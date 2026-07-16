import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AIWorkflowSection from '../components/AIWorkflowSection';
import AccessibilitySection from '../components/AccessibilitySection';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
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

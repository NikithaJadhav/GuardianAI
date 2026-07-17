import { useState } from 'react';
import Home from './pages/Home';
import EmergencyDashboard from './pages/EmergencyDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (currentPage === 'home') {
    return <Home navigateTo={navigateTo} />;
  } else if (currentPage === 'emergency') {
    return <EmergencyDashboard navigateTo={navigateTo} />;
  }

  return <Home navigateTo={navigateTo} />;
}

export default App;

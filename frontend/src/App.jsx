import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import EmergencyDashboard from './pages/EmergencyDashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import ProtectedRoute from './components/ProtectedRoute';
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
    return (
      <ProtectedRoute>
        <EmergencyDashboard navigateTo={navigateTo} />
      </ProtectedRoute>
    );
  } else if (currentPage === 'contacts') {
    return (
      <ProtectedRoute>
        <EmergencyContacts navigateTo={navigateTo} />
      </ProtectedRoute>
    );
  }

  return <Home navigateTo={navigateTo} />;
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;

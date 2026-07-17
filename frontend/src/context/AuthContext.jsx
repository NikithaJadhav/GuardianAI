import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  subscribeToAuthChanges, 
  loginUser, 
  registerUser, 
  logoutUser 
} from '../firebase/firebaseService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (email, password, displayName) => {
    const result = await registerUser(email, password, displayName);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Validate token with backend
      // For now, we'll just set a basic user object
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Implement actual login API call
      // For now, we'll just simulate a successful login
      const token = 'dummy-token';
      localStorage.setItem('token', token);
      setUser({
        id: '1',
        name: 'John Doe',
        email: email,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // TODO: Implement actual registration API call
      // For now, we'll just simulate a successful registration
      const token = 'dummy-token';
      localStorage.setItem('token', token);
      setUser({
        id: '1',
        name: name,
        email: email,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 
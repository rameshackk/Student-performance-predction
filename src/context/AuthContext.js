import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (token && role && email) {
      setCurrentUser({ email });
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', email);
        setCurrentUser({ email });
        setUserRole(data.role);
        return true;
      }
      return false;
    } catch(err) {
      console.error(err);
      return false;
    }
  };

  const signup = async (email, password, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', email);
        setCurrentUser({ email });
        setUserRole(data.role);
        return true;
      }
      return false;
    } catch(err) {
      console.error(err);
      return false;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setCurrentUser({ email: 'Google User' });
        setUserRole(data.role);
        return true;
      }
      return false;
    } catch(err) {
      console.error('Google login failed:', err);
      return false;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = { currentUser, userRole, login, signup, logout, googleLogin };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
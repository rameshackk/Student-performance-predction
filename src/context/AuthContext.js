import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const VALID_USERS = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { email: 'student@example.com', password: 'student123', role: 'student' },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = (email, password) => {
    const user = VALID_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser({ email: user.email });
      setUserRole(user.role);
      return true;
    }
    return false;
  };

  const signup = (email, password, role) => {
    // For trial purposes, we'll just log them in directly
    setCurrentUser({ email });
    setUserRole(role);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = { currentUser, userRole, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
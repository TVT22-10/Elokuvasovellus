import React, { createContext, useState } from 'react';
import { jwtToken } from './Signals'; // Removed unused userData import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  // Function to update the login state
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);  // Update user state with passed userData
  };
  

  const logout = () => {
    setIsLoggedIn(false);
    setUser({});  // Reset user data
    jwtToken.value = ''; // Reset jwtToken
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

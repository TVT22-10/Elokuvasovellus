import React, { createContext, useState } from 'react';
import { jwtToken, userData } from './Signals'; // Adjust the path as necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to update the login state
  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    jwtToken.value = ''; // Reset jwtToken
    userData.value = {}; // Reset userData
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

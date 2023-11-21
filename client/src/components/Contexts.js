import React, { createContext, useState, useEffect } from 'react';
import { jwtToken } from './Signals'; // Removed unused userData import
import axios from 'axios';
import { getSessionToken } from './Signals';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getSessionToken());
  const [user, setUser] = useState({});

  useEffect(() => {
    // Check if the JWT token is valid and update user state accordingly
    const token = getSessionToken();
    if (token) {
      // Optionally verify if the token is still valid
      // Fetch user data using the token and update user state
      axios.get('http://localhost:3001/user/private', { headers: { Authorization: `Bearer ${token}` }})
        .then(resp => {
          setUser(resp.data);
          setIsLoggedIn(true);
        })
        .catch(err => {
          console.log(err);
          // Handle expired or invalid token
          setIsLoggedIn(false);
          sessionStorage.removeItem('token');
        });
    }
  }, []);

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

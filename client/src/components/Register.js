// Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

function Register() {
  const [uname, setUname] = useState('');
  const [pw, setPw] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // New state for success message
  const navigate = useNavigate(); // Hook to navigate

  const validatePassword = () => {
    if (pw.length < 5) {
      setError('Password must be at least 5 characters long');
      return false;
    }

    if (!/\d/.test(pw)) {
      setError('Password must include at least one number');
      return false;
    }

    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!validatePassword()) {
      return; // Stop the registration process if validation fails
    }

    axios.post('http://localhost:3001/User/register', { uname, pw, fname, lname })
      .then(response => {
        console.log(response.data);
        setSuccess(true); // Set success state to true
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/Auth'); // assuming '/login' is your login route
        }, 2000); // Redirect after 2 seconds
      })
      .catch(error => {
        console.error('Registration error:', error);
        setError(error.response?.data?.error || 'An error occurred during registration');
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            placeholder="First Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Last Name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <p style={{ color: 'green' }}>
          Registration successful! Redirecting to login...
        </p>
      )}
    </div>
  );
}

export { Register };

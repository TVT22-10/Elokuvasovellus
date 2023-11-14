// Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [uname, setUname] = useState('');
  const [pw, setPw] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    axios.post('http://localhost:3001/User/register', { uname, pw, fname, lname })
      .then(response => {
        console.log(response.data);
        // Handle successful registration (e.g., show success message, redirect, etc.)
      })
      .catch(error => {
        console.error('Registration error:', error);
        setError(error.response?.data?.error || 'An error occurred during registration');
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={fname}
            onChange={e => setFname(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lname}
            onChange={e => setLname(e.target.value)}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={uname}
            onChange={e => setUname(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export { Register };

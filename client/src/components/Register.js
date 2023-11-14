import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [uname, setUname] = useState('');
  const [pw, setPw] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // New state for success message
  const navigate = useNavigate(); // Hook to navigate

  const handleRegister = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

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
      {success && <p style={{ color: 'green' }}>Registration successful! Redirecting to login...</p>}
    </div>
  );
}
export { Register };

import React, { useContext, useState } from "react";
import { AuthContext } from './Contexts';
import { jwtToken, userData } from "./Signals";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

function UserInfo() {
  const { isLoggedIn } = useContext(AuthContext);

  const formatCreationTime = (timestamp) => {
    // ... (unchanged)
  };

  const formattedCreationTime = formatCreationTime(userData.value?.creation_time);

  return (
    <div className="user-info">
      {isLoggedIn ? (
        <>
          <h1>{userData.value?.private}</h1>
          <p>Account Created On: {formattedCreationTime}</p>
        </>
      ) : (
        <div className="guest-message">
          <h1>You are a guest until you login</h1>
        </div>
      )}
    </div>
  );
}

function LoginForm() {
  const [uname, setUname] = useState('');
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogin() {
    axios
      .post('http://localhost:3001/User/login', { uname, pw }) // Use axios.post here
      .then((resp) => {
        console.log('Login response:', resp);

        if (resp.data && resp.data.jwtToken) {
          jwtToken.value = resp.data.jwtToken;
          userData.value = resp.data.userData;
          login(resp.data.userData);
          navigate('/');
        } else {
          console.log('JWT Token not found in response');
          setErrorMessage('Invalid username or password'); // Set error message
        }
      })
      .catch((error) => {
        console.log(error.response ? error.response.data : error);
        if (error.response) {
          // If server responds with an error, set a more specific error message
          if (error.response.status === 401) {
            setErrorMessage('Unauthorized: Invalid username or password');
          } else {
            setErrorMessage('An error occurred. Please try again.');
          }
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
  }

  return (
    <div className="auth-container">
      <div className="input-group">
        <input
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      <p>
        No account? <Link className="link" to="/register">Create a new account</Link>
      </p>
    </div>
  );
}

function Login() {
  const { isLoggedIn, logout } = useContext(AuthContext);


  return (
    <div>
      <UserInfo />
      {!isLoggedIn ? <LoginForm /> : <button onClick={logout}>Logout</button>}
    </div>
  );
}

export {Login};
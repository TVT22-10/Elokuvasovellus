import React, { useState } from 'react';
import './register.css'; // This uses CSS modules.

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    // Check if username and password are not empty
    if (username.trim() !== '' && password.trim() !== '') {
      // Simulate a successful registration
      setIsRegistered(true);
    } else {
      alert('Please enter both username and password.');
    }
  };

  return (
    <div>
      <head>
        <title>Register</title>
        <link rel="stylesheet" href="register.css" />
      </head>
      <body>
        <h1>Elokuvakerho</h1>
        <h2>Luo käyttäjä</h2>
        <label htmlFor="username">Käyttäjätunnus</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Salasana</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="register-button" onClick={handleRegister}>
          Rekisteröidy!
        </div>
        {isRegistered && <p>Tervetuloa elokuvakerhon jäseneksi!</p>}
      </body>
    </div>
  );
}

export default Register;

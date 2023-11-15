import React, { useState } from 'react';
import './register.css'; // This uses CSS modules.

function Profile() {
  const [currentView, setCurrentView] = useState('default');

  const changeView = (view) => {
    setCurrentView(view);
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
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Salasana</label>
        <input type="password" id="password" name="password" />
        <div className="register-button" onClick={() => changeView('register')}>
          Rekisteröidy!
        </div>
        <p>Tervetuloa elokuvakerhon jäseneksi!</p>
      </body>
    </div>
  );
}

export default Profile;

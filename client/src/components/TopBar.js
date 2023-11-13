import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './TopBar.css'; // Import css files


function TopBar() {
  return (
    <div className="top-bar">
      <h1>Elokuvakerho</h1>
      <div className="login-link">
        <Link to="/Auth">Login</Link> {/* Link to the login page */}
      </div>
    </div>
  );
}

export default TopBar;
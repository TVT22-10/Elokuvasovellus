// Import necessary libraries and components
import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';

function TopBar() {
  return (
    <div className="top-bar">
      <h1 style ={{ fontSize:'25px'}}>Elokuvakerho</h1>
      <div className="button-container">
        <div className="custom-button">
          <Link to="/Search">Search</Link>
        </div>
        <div className="custom-button">
          <Link to="/Browse">Browse</Link>
        </div>
        <div className="custom-button">
          <Link to="/Groups">Groups</Link>
        </div>
        <div className="profile-link">
          <Link to="/Profile">Profile</Link>
        </div>
        <div className="login-link">
          <Link to="/Auth">Login</Link>
        </div>
      </div>
    </div>
  );
}
export default TopBar;

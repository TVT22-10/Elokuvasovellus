// Import necessary libraries and components
import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';

// Define the TopBar component
function TopBar() {
  return (
    <div className="top-bar">
      <h1 style ={{ fontSize:'25px'}}>Elokuvakerho</h1>
      <div className="button-container">
        {/* Search Button */}
        <div className="custom-button">
          <Link to="/Search">Search</Link>
        </div>

        {/* Browse Button */}
        <div className="custom-button">
          <Link to="/Browse">Browse</Link>
        </div>

        {/* Groups Button */}
        <div className="custom-button">
          <Link to="/Groups">Groups</Link>
        </div>

        {/* Profile Button */}
        <div className="profile-link">
          <Link to="/Profile">Profile</Link>
        </div>

        {/* Login Button */}
        <div className="login-link">
          <Link to="/Auth">Login</Link>
        </div>
      </div>
    </div>
  );
}

// Export the TopBar component
export default TopBar;

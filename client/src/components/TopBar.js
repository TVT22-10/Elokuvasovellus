// Import necessary libraries, components, and context
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Contexts'; // Adjust the path as necessary
import './TopBar.css';

// Define the TopBar component
function TopBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  
  const handleLogout = () => {
    logout();
    // The navigation to '/' will be handled by the Link component itself
  };

  return (
    <div className="top-bar">
    <div className="topbartitle">
    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1><span className="text-white">Elokuva</span><span className="text-blue">Kerho</span></h1>
        </Link>
  </div>
      <div className="button-container">
        {/* Always visible: Search and Browse Buttons */}
        <div className="custom-button">
          <Link to="/Search">Search</Link>
        </div>
        <div className="custom-button">
          <Link to="/Browse">Browse</Link>
        </div>

        {/* Conditionally visible based on login status */}
        {isLoggedIn && (
          <>
            <div className="custom-button">
              <Link to="/search_groups">Groups</Link>
            </div>
            <div className="profile-link">
              <Link to="/Profile">Profile</Link>
            </div>
          </>
        )}

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <div className="login-link" onClick={logout}>
          <Link to="/" onClick={handleLogout}>Logout</Link>
        </div>
        ) : (
          <div className="login-link">
            <Link to="/Auth">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the TopBar component
export default TopBar;

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Contexts'; // Adjust the path as necessary
import './TopBar.css';

function TopBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);




  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSearchDropdown = () => {
    setShowSearchDropdown(!showSearchDropdown);
  };

  return (
    <div className="top-bar">
      <div className="topbartitle">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>
            <span className="text-white">Elokuva</span>
            <span className="text-blue">Kerho</span>
          </h1>
        </Link>
      </div>
      <div className="button-container">
        <div className="browse-button" onClick={toggleSearchDropdown}>
        <span>Search</span>
          {showSearchDropdown && (
            <div className="dropdown-menu">
              <Link to="/Search">Movies</Link>
              <Link to="/SearchTV">Series</Link>
            </div>
          )}
        </div>
        <div className="browse-button" onClick={toggleDropdown}>
          <span>Browse</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/Browse_reviews">Reviews</Link>
              <Link to="/browse_all">Movies</Link>
              <Link to="/browse_series">Series</Link>
              <Link to="/news">News</Link>
              <Link to="/browse_groups">Groups</Link>
              <Link to="/leaderboards">Stats</Link>

            </div>
          )}
        </div>
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
        {isLoggedIn ? (
          <div className="login-link" onClick={logout}>
            <Link to="/">Logout</Link>
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

export default TopBar;

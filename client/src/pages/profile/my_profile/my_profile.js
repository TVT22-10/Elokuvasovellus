import React, { useState } from 'react';
import './my_profile.css'; // This uses CSS modules.
import avatar from "./avatar.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Profile() {
    const [currentView, setCurrentView] = useState('default');

    const changeView = (view) => {
        setCurrentView(view);
    };
    return (
            <div className="profile-page">
            <div className="container">
                {/*<div className="top-bar">
                    <h1>Elokuvakerho</h1>
                    <nav>
                        <p>Etsi</p>
                        <p>Selaa</p>
                        <p>Ryhmät</p>
                        <p>Profiili</p>
                    </nav>
                </div> */}
                <hr className="separator"></hr>
                <div className="profile">
                    <img src={avatar} alt="Avatar" class="avatar" />
                    <div className="username">
                        <h2>Username</h2>
                        <div className="share-button">
                            <button id="edit">Share the view</button>
                        </div>
                    </div>
                    <div className="edit-button">
                    <button id="edit">Profile Settings</button>
                </div>
                </div>
            </div>
            


            <div className="profile-buttons">
              <button onClick={() => changeView('posts')}>Posts</button>
              <button onClick={() => changeView('favourites')}>Favourites</button>
              <button onClick={() => changeView('reviews')}>Reviews</button>
            </div>
            <div className="profile-content">
          {/* Vaihtuvat näkymät */}
          <div>
            {currentView === 'posts' && (
              <div>
                <h3>Posts</h3>
                <p>Tämä on posts-näkymä.</p>
              </div>
            )}
            {currentView === 'favourites' && (
              <div>
                <h3>Favourites</h3>
                <p>Tämä on favourites-näkymä.</p>
              </div>
            )}
            {currentView === 'reviews' && (
              <div>
                <h3>Reviews</h3>
                <p>Tämä on reviews-näkymä.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Profile;
import React, { useState } from 'react';
import './my_profile.css'; // This uses CSS modules.
import avatar from "./avatar.png";

function Profile() {
  const [activeTab, setActiveTab] = useState('favourites'); // State for active tab

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-image">
            <img src={avatar} alt="Avatar" className="avatar" />
          </div>
          <div className="profile">
            <div className="username">
              <h2>Username here</h2>
            </div>
            <div className="share-button">
              <button id="edit">Share the view</button>
            </div>
            <div className="edit-button">
              <button id="edit">Profile Settings</button>
            </div>
          </div>
        </div>
        <div className="profile-buttons">
          <p className={`view-change ${activeTab === 'favourites' ? 'active-link' : ''}`} onClick={() => setActiveTab('favourites')}>Favourites</p>
          <p className={`view-change ${activeTab === 'reviews' ? 'active-link' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</p>
          <p className={`view-change ${activeTab === 'posts' ? 'active-link' : ''}`} onClick={() => setActiveTab('posts')}>Posts</p>
        </div>
        <div className="profile-content">
          <div className={`content ${activeTab !== 'favourites' && 'hidden'}`} id="favourites">
            <p>Tähän tulis sitten käyttäjän tykätyt elokuvat</p>
          </div>
          <div className={`content ${activeTab !== 'reviews' && 'hidden'}`} id="reviews">
            <p>Tähän tulis sitten käyttäjän arvostelut</p>
          </div>
          <div className={`content ${activeTab !== 'posts' && 'hidden'}`} id="posts">
            <p>Tähän tulis sitten käyttäjän postaukset</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

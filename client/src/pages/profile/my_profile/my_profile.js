import React, { useState, useEffect } from 'react';
import './my_profile.css'; // This uses CSS modules.
import avatar from "./avatar.png";
import { jwtToken, userData } from "../../../components/Signals";
import { Link } from 'react-router-dom';


function Profile() {
  const [activeTab, setActiveTab] = useState('favourites'); // State for active tab
  const [username, setUsername] = useState(''); // State for the username
  const [creationDate, setCreationDate] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // State to track login
  // Function to generate a shareable link based on the current view
  const generateShareableLink = () => {
    const currentLink = `${window.location.origin}/profile?tab=${activeTab}`;
    
    // Copying the generated link to the clipboard
    navigator.clipboard.writeText(currentLink)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Unable to copy link: ', error);
      });
  };

  useEffect(() => {
    // Check if userData.value has the necessary properties before setting state
    if (userData.value) {
      if (userData.value.username && username !== userData.value.username) {
        setUsername(userData.value.username);
        setLoggedIn(true);
      }
      if (userData.value.creation_time && creationDate !== formatCreationDate(userData.value.creation_time)) {
        const formattedCreationDate = formatCreationDate(userData.value.creation_time);
        setCreationDate(formattedCreationDate);
      }
    }
  }, [userData.value, username, creationDate]); // Include username and creationDate in the dependency array
  
    // Seuraa userData-tilan muutoksia
  //console.log(userData.value);
  
  const formatCreationDate = (timestamp) => {
    if (!timestamp) {
      return 'No creation time';
    }
    
    let date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Invalid Format';
    }

    return date.toLocaleDateString();
  };

  
return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-image">
            <img src={avatar} alt="Avatar" className="avatar" />
          </div>
          <div className="profile">
            <div className="username">
              <h2>{username}</h2>
              <p>Account Created On: {creationDate}</p>
            </div>
            <div className="bio-buttons">
            <div className="share-button">
              <button id="edit" onClick={generateShareableLink}>Share the view</button>
            </div>
            <div className="edit-button">
            <Link to="/edit_profile">
          <button id="edit">Profile Settings</button>
        </Link>
            </div>
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
import React, { useState, useEffect } from 'react';
import './group_page.css'; // This uses CSS modules.
import avatar from "./avatar.png";
import { jwtToken, userData } from "../../../components/Signals";
import { Link } from 'react-router-dom';


function GroupPage() {
  const [groupName, setGroupName] = useState(''); // State for the username
  const [creationDate, setCreationDate] = useState('');


//   useEffect(() => {
//     // Check if userData.value has the necessary properties before setting state
//     if (userData.value) {
//       if (userData.value.username && username !== userData.value.username) {
//         setUsername(userData.value.username);
//       }
//       if (userData.value.creation_time && creationDate !== formatCreationDate(userData.value.creation_time)) {
//         const formattedCreationDate = formatCreationDate(userData.value.creation_time);
//         setCreationDate(formattedCreationDate);
//       }
//     }
//   }, [userData.value, username, creationDate]); // Include username and creationDate in the dependency array
  
//     // Seuraa userData-tilan muutoksia
//   //console.log(userData.value);
  
//   const formatCreationDate = (timestamp) => {
//     if (!timestamp) {
//       return 'No creation time';
//     }
    
//     let date;
//     if (typeof timestamp === 'number') {
//       date = new Date(timestamp * 1000);
//     } else if (typeof timestamp === 'string') {
//       date = new Date(timestamp);
//     } else {
//       return 'Invalid Format';
//     }

//     return date.toLocaleDateString();
//   };


return (
    <div className="Group-page">
      
        <div className="group-container">
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
            <Link to="/edit_group">
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
  );
}

export default GroupPage;
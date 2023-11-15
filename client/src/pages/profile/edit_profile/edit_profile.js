import React, { useState, useEffect } from 'react';
import avatar from './avatar.png';
import './edit_profile.css'; // Ota huomioon CSS-tiedosto
import { jwtToken, userData } from "../../../components/Signals";

function EditProfile() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState(''); // State for the username
  const [creationDate, setCreationDate] = useState('');
    
  useEffect(() => {
        if (userData.value && userData.value.username) {
          setUsername(userData.value.username);
        }
        if (userData.value && userData.value.creation_time) {
          const formattedCreationDate = formatCreationDate(userData.value.creation_time);
          setCreationDate(formattedCreationDate);
        }
      }, [userData.value]); 
      // Seuraa userData-tilan muutoksia
    console.log(userData.value);  


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


  const handleFnameChange = (e) => {
    setFname(e.target.value);
  };

  const handleLnameChange = (e) => {
    setLname(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    // Käsittelijä profiilikuvan muokkaamiseksi
    // Täällä voit käyttää esim. FileReaderia tiedoston lataamiseen ja asettamiseen stateen
  };

  const handleProfileUpdate = () => {
    // Käsittele profiilin päivitys täällä (esim. axios.put() -pyynnöllä)
  };

  const handleDeleteProfile = () => {
    // Käsittele profiilin poisto täällä (esim. axios.delete() -pyynnöllä)
    // Muista varmistaa käyttäjän toiminta ennen profiilin poistamista
  };

  return (
    
    <div className="edit-profile">
      <div className="profile-picture">
        <img src={profilePic || avatar} alt="Profile" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      </div>
      <div className="name-inputs">
        <input type="text" value={fname} onChange={handleFnameChange} placeholder="First Name" />
        <input type="text" value={lname} onChange={handleLnameChange} placeholder="Last Name" />
      </div>
      <button onClick={handleProfileUpdate}>Save Changes</button>
      <button onClick={handleDeleteProfile}>Delete Profile</button>
        <h1>Edit Profile</h1>
    </div>
    
  );
  }
export default EditProfile;

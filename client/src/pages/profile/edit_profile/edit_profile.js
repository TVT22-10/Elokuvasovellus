import React, { useState, useEffect } from 'react';
import avatar from './avatar.png';
import './edit_profile.css'; // Ota huomioon CSS-tiedosto
import { userData } from "../../../components/Signals";
import axios from 'axios';

function Edit_Profile() {

  const [fname, setFname] = useState(userData.value?.firstName || '');
  const [lname, setLname] = useState(userData.value?.lastName || '');
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState(''); // State for the username
  const [changesSaved, setChangesSaved] = useState(false); // State to track if changes are saved

  useEffect(() => {
    if (userData.value && userData.value.username) {
      setUsername(userData.value.username);
      setFname(userData.value.firstName || ''); // Set initial value for first name
      setLname(userData.value.lastName || ''); // Set initial value for last name 
    }
  }, [userData.value]);

  console.log(userData.value);

  
  const handleFnameChange = (e) => {
    setFname(e.target.value);
  };

  const handleLnameChange = (e) => {
    setLname(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    // Käsittele profiilin päivitys täällä (esim. axios.put() -pyynnöllä)
    console.log('Updated First Name:', fname);
    console.log('Updated Last Name:', lname);

    setTimeout(() => {
        setChangesSaved(false);
      }, 3000);

      const updatedUserData = {
        firstName: fname,
        lastName: lname,
      };
  
      axios.put('http://localhost:3001/User/Edit_Profile', updatedUserData)
    .then(response => {
      console.log('Profile updated:', response.data);
      setChangesSaved(true); // Merkitse muutokset tallennetuiksi
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      // Käsittely virhetilanteessa
    });


    };

   
    const handleDeleteProfile = () => {
      // Käsittele profiilin poisto täällä (esim. axios.delete() -pyynnöllä)
    };


  return (
    <div className="edit-profile">
      <div className="profile-picture">
        <img src={profilePic || avatar} alt="Profile" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      </div>
      <div className="username-section">
        <h2>{username}</h2>
      </div>
      <div className="name-inputs">
      <input type="text" value={fname} onChange={handleFnameChange} placeholder={userData.value ? userData.value.fname : "First Name"} />
      <input type="text" value={lname} onChange={handleLnameChange} placeholder={userData.value ? userData.value.lname : "Last Name"} />
  
      </div>
      <button onClick={handleProfileUpdate}>Save Changes</button>
      <button onClick={handleDeleteProfile}>Delete Profile</button>
      {changesSaved && <p>Changes have been saved!</p>}
    </div>
  );
}
export default Edit_Profile;

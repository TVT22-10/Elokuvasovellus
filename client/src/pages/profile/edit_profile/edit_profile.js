import React, { useState, useEffect } from 'react';
import avatar from './avatar.png';
import './edit_profile.css'; // Ota huomioon CSS-tiedosto
import { userData } from "../../../components/Signals";
import axios from 'axios';
import { Link } from 'react-router-dom';

function Edit_Profile() {

  const [fname, setFname] = useState(userData.value?.firstName || '');
  const [lname, setLname] = useState(userData.value?.lastName || '');
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState(''); // State for the username
  const [changesSaved, setChangesSaved] = useState(false); // State to track if changes are saved
  const [post, setPost] = useState({
    fname: '',
    lname: '',
})

  useEffect(() => {
    axios.get('http://localhost:3001/User/Edit_Profile').then(res => console.log(res.data))
   
    if (userData.value && userData.value.username) {
      setUsername(userData.value.username);
      setFname(userData.value.firstName || ''); // Set initial value for first name
      setLname(userData.value.lastName || ''); // Set initial value for last name 
    }
  }, [userData.value]);

  console.log(userData.value);

    const handleInput = (event) => {
        setPost({...post, [event.target.name]: event.target.value})

    }

    function handleSubmit(event) {
        event.preventDefault()
        axios.put('http://localhost:3001/User/Edit_Profile', {post})
        .then (res => console.log(res.data))
        .catch(err => console.log(err))
    }
//   const handleFnameChange = (e) => {
//     setFname(e.target.value);
//   };

//   const handleLnameChange = (e) => {
//     setLname(e.target.value);
//   };

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         setProfilePic(event.target.result);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfileUpdate = () => {
//     // Käsittele profiilin päivitys täällä (esim. axios.put() -pyynnöllä)
//     console.log('Updated First Name:', fname);
//     console.log('Updated Last Name:', lname);

//     setTimeout(() => {
//         setChangesSaved(false);
//       }, 3000);

//       const updatedUserData = {
//         firstName: fname,
//         lastName: lname,
//       };
  
    //   axios.put('http://localhost:3001/User/Edit_Profile', updatedUserData)
    // .then(response => {
    //   console.log('Profile updated:', response.data);
    //   setChangesSaved(true); // Merkitse muutokset tallennetuiksi
    // })
    // .catch(error => {
    //   console.error('Error updating profile:', error);
    //   // Käsittely virhetilanteessa
    // });


    // };

   
    // const handleDeleteProfile = () => {
    //   // Käsittele profiilin poisto täällä (esim. axios.delete() -pyynnöllä)
    // };


  return (
    <div className="edit-profile">
      <div className="profile-picture">
        <img src={profilePic || avatar} alt="Profile" />
        <input type="file" accept="image/*" />
      </div>
      <div className="username-section">
        <h2>{username}</h2>
      </div>
      {/* <div className="name-inputs"> */}
      {/* Firstname: <input type="text" value={fname} onChange={handleFnameChange} placeholder={userData.value ? userData.value.fname : "First Name"} />
      Lastname:<input type="text" value={lname} onChange={handleLnameChange} placeholder={userData.value ? userData.value.lname : "Last Name"} /> */}
      <form onSubmit={handleSubmit}>
      Firstname: <input type="text" onChange={handleInput} name="fname"></input><br/><br />
      Lastname: <input type="text" onChange={handleInput} name="lname"></input><br/><br />
      {/* <button onClick={handleProfileUpdate}>Save Changes</button> */}
      <button classname='btn btn-primary'>Save Changes</button>   
      {/*<button onClick={handleDeleteProfile}>Delete Profile</button>*/}
      {/*{changesSaved && <p>Changes have been saved!</p>}*/}
        </form>
    </div>
  );
}
export default Edit_Profile;

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
        // Fetch user data when the component mounts
        // Assuming your backend API endpoint for user data is '/user/profile'
        axios.get('/user/profile')
            .then(response => {
                const { firstName, lastName } = response.data; // Destructuring firstName and lastName from response.data
                setFname(firstName || ''); // Setting fname state with the value of firstName from the response or an empty string if it's undefined/null
                setLname(lastName || '');
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });


        if (userData.value && userData.value.username) {
            setUsername(userData.value.username);

        }
    }, [userData.value]);

    //console.log(userData.value);


    const handleInput = (event) => {
        const { name, value } = event.target;
        if (name === 'fname') {
            setFname(value);
        } else if (name === 'lname') {
            setLname(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const updatedUserData = {
            firstName: fname,
            lastName: lname,
          };
          // Send PUT request to update user data
          await axios.put('/user/profile', updatedUserData);
          // Handle success: Optional
        } catch (error) {
          console.error('Error updating profile:', error);
          // Handle error: Optional
        }
        setChangesSaved(true); // Merkitse muutokset tallennetuiksi
      };


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
                <div className="name-inputs">
                    First Name: <input type="text" name="fname" value={fname} onChange={handleInput} placeholder={userData.value ? userData.value.fname : "First Name"} />
                    Last Name: <input type="text" name="lname" value={lname} onChange={handleInput} placeholder={userData.value ? userData.value.lname : "Last Name"} />
                </div>
                {/* <button onClick={handleProfileUpdate}>Save Changes</button> */}
                <div className="save-button">
                    <button id="save-button">Save</button>
                </div>
                {/*<button onClick={handleDeleteProfile}>Delete Profile</button>*/}
                {/*{changesSaved && <p>Changes have been saved!</p>}*/}
            </form>
        </div>
    );
}
export default Edit_Profile;
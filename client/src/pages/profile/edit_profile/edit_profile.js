import React, { useState, useEffect } from 'react';
import avatar from './avatar.png';
import './edit_profile.css';
import { jwtToken, userData } from "../../../components/Signals";
import axios from 'axios';

function Edit_Profile() {
    const [fname, setFname] = useState(userData.value?.firstName || '');
    const [lname, setLname] = useState(userData.value?.lastName || '');
    const [profilePic, setProfilePic] = useState(null);
    const [changesSaved, setChangesSaved] = useState(false);

    useEffect(() => {
        const token = jwtToken.value;

        // Fetch user data when the component mounts if it's not already available
        if (!userData.value || !userData.value.firstName || !userData.value.lastName) {
            axios.get('http://localhost:3001/user/private', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                const { firstName, lastName } = response.data;
                setFname(firstName || '');
                setLname(lastName || '');
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    const handleInput = (event) => {
        const { name, value } = event.target;
        if (name === 'fname') setFname(value);
        if (name === 'lname') setLname(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedUserData = {
                firstName: fname,
                lastName: lname,
            };
            const token = jwtToken.value;
            await axios.put('http://localhost:3001/user/profile', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setChangesSaved(true);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="edit-profile">
            <div className="profile-picture">
                <img src={profilePic || avatar} alt="Profile" />
                <input type="file" accept="image/*" />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="name-inputs">
                    First Name: 
                    <input 
                        type="text" 
                        name="fname" 
                        value={fname} 
                        onChange={handleInput} 
                        placeholder={userData.value ? userData.value.fname : "First Name"} 
                    />
                    Last Name: 
                    <input 
                        type="text" 
                        name="lname" 
                        value={lname} 
                        onChange={handleInput} 
                        placeholder={userData.value ? userData.value.lname : "Last Name"} 
                    />
                </div>
                <div className="save-button">
                    <button type="submit">Save</button>
                </div>
                {changesSaved && <p>Changes have been saved!</p>}
            </form>
        </div>
    );
}

export default Edit_Profile;

import React, { useState, useEffect } from 'react';
import './edit_profile.css';
import { jwtToken, userData } from "../../../components/Signals";
import axios from 'axios';

function Edit_Profile() {
    const [fname, setFname] = useState(userData.value?.fname || '');
    const [lname, setLname] = useState(userData.value?.lname || '');
    const [changesSaved, setChangesSaved] = useState(false);
    const [availableAvatars, setAvailableAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(userData.value?.avatar || 'avatar1.png'); // Default to 'avatar1.png'
    const [showAvatarDropdown, setShowAvatarDropdown] = useState(false); // New state for toggling avatar dropdownz

    useEffect(() => {
        const token = jwtToken.value;

        // Fetch user data
        if (!userData.value || !userData.value.fname || !userData.value.lname) {
            axios.get('http://localhost:3001/user/private', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                const { fname, lname, avatar } = response.data;
                setFname(fname || '');
                setLname(lname || '');
                setSelectedAvatar(avatar || 'avatar1.png');
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    useEffect(() => {
        // Fetch available avatars
        axios.get('http://localhost:3001/avatars')
            .then(response => {
                setAvailableAvatars(response.data);
            })
            .catch(error => console.error('Error fetching avatars:', error));
    }, []);

    const handleInput = (event) => {
        const { name, value } = event.target;
        if (name === 'fname') setFname(value);
        if (name === 'lname') setLname(value);
    };

    const handleAvatarSelect = (avatarName) => {
        setSelectedAvatar(avatarName);
        setShowAvatarDropdown(false); // Hide the dropdown after selection
    };

    const toggleAvatarDropdown = () => {
        setShowAvatarDropdown(!showAvatarDropdown); // Toggle dropdown visibility
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedUserData = {
                firstName: fname,
                lastName: lname,
                avatar: selectedAvatar
            };
            const token = jwtToken.value;
            await axios.put('http://localhost:3001/user/profile', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setChangesSaved(true);
            // Update userData in Signals
            userData.value = {...userData.value, fname, lname, avatar: selectedAvatar};
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Inside the Edit_Profile component
const handleDeleteUser = async () => {
    try {
        const token = jwtToken.value;
        // Assuming userData.value contains the username
        const username = userData.value.username;
        
        const confirmed = window.confirm('Are you sure you want to delete your user? This action cannot be undone.');

        if (confirmed) {
            await axios.delete(`http://localhost:3001/user/delete/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Perform any necessary cleanup or redirection after deletion
            // For example:
            // Redirect the user to a different page or perform logout actions
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};


    return (
        <div className="edit-profile">
            {/* Current Profile Picture */}
            <div className="current-profile-picture">
            <img src={`http://localhost:3001/avatars/${selectedAvatar}`} alt="Current Profile" className="current-avatar" />
            <button onClick={toggleAvatarDropdown} className="change-avatar-button">Change Avatar</button>
            </div>

            {showAvatarDropdown && (
                <div className="avatar-selection">
                    {availableAvatars.map((avatarName, index) => (
                        <img 
                            key={index} 
                            src={`http://localhost:3001/avatars/${avatarName}`} 
                            alt={`Avatar ${index}`}
                            onClick={() => handleAvatarSelect(avatarName)}
                            className={selectedAvatar === avatarName ? 'selected-avatar' : 'avatar-option'}
                        />
                    ))}
                </div>
            )}

            {/* User Details Form */}
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

            {/* Delete User Button */}
            <div className="delete-user">
            <button onClick={handleDeleteUser}>Delete user</button>
            </div>
        </div>
    );
}

export default Edit_Profile;
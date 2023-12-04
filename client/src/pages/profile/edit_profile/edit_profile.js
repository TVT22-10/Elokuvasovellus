import React, { useState, useEffect, useContext } from 'react';
import './edit_profile.css';
import { jwtToken, userData } from "../../../components/Signals";
import axios from 'axios';
import { AuthContext } from '../../../components/Contexts'; // Adjust the import path
import EmojiPicker from 'emoji-picker-react';

function Edit_Profile() {
    const [fname, setFname] = useState(userData.value?.fname || '');
    const [lname, setLname] = useState(userData.value?.lname || '');
    const [changesSaved, setChangesSaved] = useState(false);
    const [availableAvatars, setAvailableAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(userData.value?.avatar || 'avatar1.png'); // Default to 'avatar1.png'
    const [showAvatarDropdown, setShowAvatarDropdown] = useState(false); // New state for toggling avatar dropdownz
    const { logout } = useContext(AuthContext); // Access the logout function
    const [bio, setBio] = useState(userData.value?.bio || '');
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);




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
                const avatars = response.data.filter(avatar => avatar !== 'npc.png');

                setAvailableAvatars(avatars);
            })
            .catch(error => console.error('Error fetching avatars:', error));
    }, []);

    const handleInput = (event) => {
        const { name, value } = event.target;
        if (name === 'fname') setFname(value);
        if (name === 'lname') setLname(value);
        if (name === 'bio') setBio(value);
    };

    const onEmojiClick = (emojiObject, event) => {
        if (emojiObject && emojiObject.emoji) {
            setBio(bio + emojiObject.emoji);
        }
    };
    
    
    


    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
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
                avatar: selectedAvatar,
                bio: bio // include bio in the update

            };
            
            const token = jwtToken.value;
            await axios.put('http://localhost:3001/user/profile', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setChangesSaved(true);
            // Update userData in Signals
            userData.value = { ...userData.value, fname, lname, avatar: selectedAvatar, bio };
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };



    // Updated handleDeleteUser function
    const handleDeleteUser = async () => {
        try {
            const token = jwtToken.value;
            const username = userData.value.username;
            const password = prompt('Please enter your password to confirm deletion:');

            if (password !== null) {
                const confirmed = window.confirm('Are you sure you want to delete your user? This action cannot be undone.');
                if (confirmed) {
                    const response = await axios.delete(`http://localhost:3001/user/delete/${username}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            password: password,
                        }
                    });

                    // Check if the server responded with a success message
                    if (response.data.message === 'User deleted successfully') {
                        window.alert('User deleted successfully');
                        logout(); // Call the logout function after successful deletion
                        window.location.href = '/Auth'; // Redirect to the login page

                    } else {
                        // Handle other server responses
                        window.alert(response.data.error || 'Error deleting user. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            window.alert('Error deleting user. Please try again.');
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
                <div className="bio-input">
                    Bio:
                    <textarea
                        name="bio"
                        value={bio}
                        onChange={handleInput}
                        placeholder="Your bio"
                    />
                    <button onClick={toggleEmojiPicker}>Add Emoji</button>
                    {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
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
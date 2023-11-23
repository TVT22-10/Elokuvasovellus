import React, { useState, useEffect } from 'react';
import './group_page.css'; // This uses CSS modules.
import avatar from "./avatar.png";
import { jwtToken, userData } from "../../../components/Signals";
import { Link } from 'react-router-dom';


function GroupPage() {
    const [activeTab, setActiveTab] = useState('description'); // State for active tab
    const [groupName, setGroupName] = useState(''); // State for the username
    //const [creationDate, setCreationDate] = useState('');


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
                <div className="group-image">
                    <img src={avatar} alt="Avatar" className="avatar" />
                </div>
                <div className="group-profile">
                    <div className="groupName">
                        <h2>(group name)</h2>
                        {/*<p>Account Created On: {creationDate}</p>*/}
                    </div>
                    <div className="bio-buttons">
                        <div className="share-button">
                            {/* <button id="edit" onClick={generateShareableLink}>Share the view</button>*/}
                        </div>
                         <div className="editGroup-button">
            <Link to="/edit_group">
          <button id="editGroup">Group settings</button>
        </Link>
            </div>
                    </div>
                </div>
            </div>
            <div className="group-buttons">
                <p className={`view-change ${activeTab === 'description' ? 'active-link' : ''}`} onClick={() => setActiveTab('description')}>Description</p>
                <p className={`view-change ${activeTab === 'group members' ? 'active-link' : ''}`} onClick={() => setActiveTab('group members')}>Group members</p>
                <p className={`view-change ${activeTab === 'news' ? 'active-link' : ''}`} onClick={() => setActiveTab('news')}>News</p>
            </div>
            <div className="group-content">
                <div className={`content ${activeTab !== 'group settings' && 'hidden'}`} id="group settings">
                    <p>Tähän tulis sitten käyttäjän tykätyt elokuvat</p>
                </div>
                <div className={`content ${activeTab !== 'description' && 'hidden'}`} id="descriptions">
                    <p>Tähän tulis sitten käyttäjän arvostelut</p>
                </div>
                <div className={`content ${activeTab !== 'group members' && 'hidden'}`} id="group members">
                    <p>Tähän tulis sitten käyttäjän postaukset</p>
                </div>
                <div className={`content ${activeTab !== 'news' && 'hidden'}`} id="new">
                    <p>Tähän tulis sitten käyttäjän postaukset</p>
                </div>
            </div>
        </div>
    );
}

export default GroupPage;
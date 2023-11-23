import React, { useState, useEffect } from 'react';
import './group_page.css'; // This uses CSS modules.
import avatar from './avatar.png';
import axios from 'axios';
import { jwtToken } from '../../../components/Signals';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function GroupPage() {
    const [activeTab, setActiveTab] = useState('description');
    const [groupData, setGroupData] = useState(null);
    const { groupId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);


    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/groups/${groupId}/details`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken.value}`,
                    },
                });
                setGroupData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching group details:', error);
                setError(error);
                setLoading(false);
            }
        };

    
        const fetchGroupMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/groups/${groupId}/members`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken.value}`,
                    },
                });
                setGroupMembers(response.data);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };
    
        if (groupId) {
            fetchGroupDetails();
            fetchGroupMembers();
        }
    }, [groupId]);


    return (
        <div className="Group-page">

            <div className="group-container">
                <div className="group-image">
                    <img src={avatar} alt="Avatar" className="avatar" />
                </div>
                <div className="group-profile">
                    <div className="groupName">
                        {loading && <p>Loading...</p>}
                        {error && <p>Error loading group details.</p>}
                        {groupData && !loading && !error && <h2>{groupData.groupname}</h2>}
                        {/* Other details */}
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
                {loading && <p>Loading...</p>}
                        {error && <p>Error loading group details.</p>}
                        {groupData && !loading && !error && <h2>{groupData.groupdescription}</h2>}
                </div>
                <div className={`content ${activeTab !== 'group members' && 'hidden'}`} id="group members">
    {groupMembers.length > 0 ? (
        <ul>
            {groupMembers.map((member, index) => (
                <li key={index}>{member.username}</li> // Adjust according to your data structure
            ))}
        </ul>
    ) : (
        <p>No members found.</p>
    )}
</div>
                <div className={`content ${activeTab !== 'news' && 'hidden'}`} id="new">
                    <p>Tähän tulis sitten käyttäjän postaukset</p>
                </div>
            </div>
        </div>

    );
}

export default GroupPage;
import React, { useState, useEffect } from 'react';
import './group_page.css'; // This uses CSS modules.
import avatar from './avatar.png';
import axios from 'axios';
import { jwtToken, userData } from '../../../components/Signals';
import { Link, useParams } from 'react-router-dom';

function GroupPage() {
    const [activeTab, setActiveTab] = useState('description');
    const [groupData, setGroupData] = useState(null);
    const { groupId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const isMember = userData.value ? groupMembers.some(member => member.username === userData.value.username) : false;

    // Function to fetch join requests
    const fetchJoinRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/groups/${groupId}/requests`, {
                headers: {
                    Authorization: `Bearer ${jwtToken.value}`,
                },
            });
            setJoinRequests(response.data);
        } catch (error) {
            console.error('Error fetching join requests:', error);
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
                // Only fetch join requests if the logged-in user is the group owner
                if (response.data.creator_username === userData.value.username) {
                    fetchJoinRequests();
                }
            } catch (error) {
                console.error('Error fetching group details:', error);
                setError(error);
                setLoading(false);
            }
        };



        if (groupId) {
            fetchGroupDetails();
            fetchGroupMembers();
        }
    }, [groupId]); // Add dependencies here if they are used in the useEffect


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const sendJoinRequest = async () => {
        try {
            await axios.post(`http://localhost:3001/groups/${groupId}/request-join`, {}, {
                headers: { Authorization: `Bearer ${jwtToken.value}` }
            });
            alert("Join request sent successfully");
        } catch (error) {
            console.error("Error sending join request:", error);
            alert("Failed to send join request");
        }
    };

    const handleJoinRequest = async (requestId, accept) => {
        try {
            await axios.put(`http://localhost:3001/groups/${groupId}/requests/${requestId}`, { accept }, {
                headers: { Authorization: `Bearer ${jwtToken.value}` }
            });
            // Refresh join requests after handling
            fetchJoinRequests();
        } catch (error) {
            console.error('Error handling join request:', error);
        }
    };
    
    const handleRemoveMember = async (username) => {
        try {
            await axios.delete(`http://localhost:3001/groups/${groupId}/members/${username}`, {
                headers: { Authorization: `Bearer ${jwtToken.value}` },
            });
            // After successful removal, update the UI or fetch members again
            fetchGroupMembers();
        } catch (error) {
            console.error('Error removing member:', error);
            // Handle error scenarios if needed
        }
    };
    

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
                        <p>Created On: {groupData ? formatDate(groupData.created_at) : ''}</p>

                    </div>
                    <div className="bio-buttons">
                        <div className="editGroup-button">
                            <Link to="/edit_group">
                                <button id="editGroup">Group settings</button>
                            </Link>
                        </div>
                        {!isMember && (
                            <button onClick={sendJoinRequest} className="join-group-button">
                                Send Join Request
                            </button>
                        )}

                    </div>
                </div>
            </div>
            <div className="group-buttons">
                <p className={`view-change ${activeTab === 'description' ? 'active-link' : ''}`} onClick={() => setActiveTab('description')}>Description</p>
                <p className={`view-change ${activeTab === 'group members' ? 'active-link' : ''}`} onClick={() => setActiveTab('group members')}>Group members</p>
                <p className={`view-change ${activeTab === 'news' ? 'active-link' : ''}`} onClick={() => setActiveTab('news')}>News</p>
                {groupData && groupData.creator_username === userData.value.username && (
    <p className={`view-change ${activeTab === 'join requests' ? 'active-link' : ''}`} onClick={() => setActiveTab('join requests')}>Join Requests</p>
)}

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
                        <div className="members-list">
                            {groupMembers.map((member, index) => (
                                <div className="member-item" key={index}>
                                    <img src={`http://localhost:3001/avatars/${member.avatar}`} alt={`${member.username}'s avatar`} className="member-avatar" />
                                    <span className="member-name">{member.username}</span>
                                    {groupData && member.username === groupData.creator_username && <span className="owner-tag">Owner</span>}
                                    <span className="member-joined-date">{formatDate(member.joined_date)}</span>
                                    <button onClick={() => handleRemoveMember(member.username)}>Delete Member</button>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No members found.</p>
                    )}
                </div>
                <div className={`content ${activeTab !== 'news' && 'hidden'}`} id="new">
                    <p>Tähän tulis sitten käyttäjän postaukset</p>
                </div>
                <div className={`content ${activeTab !== 'join requests' && 'hidden'}`} id="join requests">
                    {groupData && groupData.creator_username === userData.value.username && (
                        <div className="join-requests-list">
                        {joinRequests.length > 0 ? (
                            joinRequests.map((request, index) => (
                                <div className="join-request-item" key={index}>
                                    <span>{request.username}</span>
                                    <button onClick={() => handleJoinRequest(request.request_id, true)}>Accept</button>
                                    <button onClick={() => handleJoinRequest(request.request_id, false)}>Decline</button>
                                </div>
                            ))
                        ) : (
                            <p>No join requests.</p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default GroupPage;
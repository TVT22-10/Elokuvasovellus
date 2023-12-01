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
    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState(groupData?.groupdescription || '');
  

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
            const confirmRemove = window.confirm('Are you sure you want to remove this member?');
            if (confirmRemove) {
                await axios.delete(`http://localhost:3001/groups/${groupId}/members/${username}`, {
                    headers: { Authorization: `Bearer ${jwtToken.value}` },
                });
                // After successful removal, update the UI or fetch members again
                fetchGroupMembers();
                window.alert('Member removed successfully');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            window.alert('Error removing member. Please try again.');
            // Handle error scenarios if needed
        }
    };
    
    const handleLeaveGroup = async (username) => {
        try {
            const confirmLeave = window.confirm('Are you sure you want to leave the group?');
            if (confirmLeave) {
                await axios.delete(`http://localhost:3001/groups/${groupId}/members/${username}`, {
                    headers: { Authorization: `Bearer ${jwtToken.value}` },
                });
                fetchGroupMembers(); // Refresh the member list after leaving the group
                window.alert('Left the group successfully');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            window.alert('Error leaving group. Please try again.');
            // Handle error scenarios if needed
        }
    };
    


  // Function to handle description edit
    const handleEditDescription = () => {
        setEditingDescription(true);
      };

 // Function to handle description change
  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
  }; 
  
  // Function to save edited description
  const handleSaveDescription = async () => {
    try {
        const response = await axios.put(
            `http://localhost:3001/groups/${groupId}/description`,
            { groupDescription: newDescription },
            {
                headers: {
                    Authorization: `Bearer ${jwtToken.value}`,
                },
            }
        );

        // Handle success scenario
        setEditingDescription(false);
        setGroupData({ ...groupData, groupdescription: newDescription });
    } catch (error) {
        console.error('Error updating description:', error);
        // Handle error scenario
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
                {!editingDescription && (
          <React.Fragment>
            {loading && <p>Loading...</p>}
            {error && <p>Error loading group details.</p>}
            {groupData && !loading && !error && (
              <div>
                <p>{groupData.groupdescription}</p>
                {userData.value.username === groupData.creator_username && (
                  <button onClick={handleEditDescription}>Edit Description</button>
                )}
              </div>
            )}
          </React.Fragment>
        )}
        {editingDescription && (
          <div>
            <textarea
              value={newDescription}
              onChange={handleDescriptionChange}
              placeholder="Enter new description..."
            />
            <div>
              <button onClick={handleSaveDescription}>Save</button>
              <button onClick={() => setEditingDescription(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
                <div className={`content ${activeTab !== 'group members' && 'hidden'}`} id="group members">
                    {groupMembers.length > 0 ? (
                        <div className="members-list">
                            {groupMembers.map((member, index) => (
                                <div className="member-item" key={index}>
                                    <img src={`http://localhost:3001/avatars/${member.avatar}`} alt={`${member.username}'s avatar`} className="member-avatar" />
                                    <span className="member-name">
                                        {member.username}
                                        {groupData && member.username === groupData.creator_username && (
                                            <React.Fragment>
                                                <span className="owner-tag">Owner</span>
                                                <span className="member-joined-date">{formatDate(member.joined_date)}</span>
                                            </React.Fragment>
                                        )}
                                    </span>
                                    {groupData && member.username !== groupData.creator_username && (
                                        <React.Fragment>
                                            <span className="member-joined-date">{formatDate(member.joined_date)}</span>
                                            {userData.value.username === member.username && (
                                                <div className="leaveGroup">
                                                <button onClick={() => handleLeaveGroup(member.username)}>Leave Group</button>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
                                    {groupData && userData.value.username === groupData.creator_username && (
                                        <React.Fragment>
                                            {userData.value.username !== member.username && (
                                                <div className="deleteMember">
                                                    <button onClick={() => handleRemoveMember(member.username)}>Delete Member</button>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
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
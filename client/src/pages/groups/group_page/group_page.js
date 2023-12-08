import React, { useState, useEffect } from 'react';
import './group_page.css'; // This uses CSS modules.
import avatar from './avatar.png';
import axios from 'axios';
import { jwtToken, userData } from '../../../components/Signals';
import { Link, useParams, useNavigate } from 'react-router-dom';
import GroupNews from '../../../xmlcomponents/GroupNews'; // Update the path based on your project structure




function GroupPage() {

  const [activeTab, setActiveTab] = useState('description');
  const [groupData, setGroupData] = useState({});
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const isUserDefined = userData && userData.value && userData.value.username;
  const isMember = isUserDefined ? groupMembers.some(member => member.username === userData.value.username) : false;
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(groupData?.groupdescription || '');
  const navigate = useNavigate();
  const [userNews, setUserNews] = useState([]);




  const navigateToPublicProfile = (username) => {
    navigate(`/public_profile/${username}`);
  };

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
        const { creator_username, ...restGroupData } = response.data;

        // Check if creator_username exists before proceeding
        if (creator_username) {
          setGroupData({ creator_username, ...restGroupData });
          setLoading(false);

          // Ensure userData.value is available and then check if the logged-in user is the group owner
          if (userData?.value && creator_username === userData.value.username) {
            fetchJoinRequests();
          }
        } else {
          // Handle the scenario where creator_username is null
          setError(new Error("Creator username is null"));
          setLoading(false);
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
      fetchUserNews(); // Call fetchUserNews to get the news for the group

    }
  }, [groupId, userData?.value]);


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
      const isOwner = groupData.creator_username === userData.value.username;
      const confirmLeave = window.confirm('Are you sure you want to leave the group?');

      if (confirmLeave) {
        if (isOwner) {
          const confirmNewOwner = window.confirm('You are the owner. You need to transfer the ownership before leaving the group. Do you want to transfer the ownership?');

          if (confirmNewOwner) {
            const newOwner = prompt('Enter the username of the new owner:');
            if (newOwner && newOwner !== groupData.creator_username) {
              try {
                const response = await axios.put(`http://localhost:3001/groups/${groupId}/assign-owner/${newOwner}`, {}, {
                  headers: { Authorization: `Bearer ${jwtToken.value}` },
                });

                                window.alert(`Ownership transferred to ${newOwner}. You can now leave the group.`);
                                // Additional logic if needed after ownership transfer
                            } catch (error) {
                                console.error('Error transferring ownership:', error);
                                window.alert('Error transferring ownership.');
                                return;
                            }
                        } else if (newOwner === groupData.creator_username) {
                            window.alert('You cannot transfer ownership to yourself.');
                            return;
                        } else {
                            window.alert('Invalid username or no username entered. Ownership not transferred.');
                            return;
                        }
                    }
                }

        await axios.delete(`http://localhost:3001/groups/${groupId}/members/${username}`, {
          headers: { Authorization: `Bearer ${jwtToken.value}` },
        });

        alert('Left the group successfully');
        fetchGroupMembers(); // Refresh the member list after leaving the group
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Error leaving group. Please try again.');
    }
  };



  // Function to handle description edit
  const handleEditDescription = () => {
    setEditingDescription(true);
  };

  // Function to handle description change
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
    if (e.key === 'Enter') {
      setNewDescription(prevDescription => prevDescription + '\n');
      e.preventDefault();
    }
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

  const fetchUserNews = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/groups/${groupId}/news`, {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,
        },
      });
      setUserNews(response.data);
    } catch (error) {
      console.error('Error fetching user news:', error);
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
        <p className={`view-change ${activeTab === 'news' || !activeTab ? 'active-link' : ''}`} onClick={() => setActiveTab('news')}>News</p>
        {groupData && userData.value && groupData.creator_username === userData.value.username && (
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
                <div className="group-description">
                  {/* Check if groupData.groupdescription is not null or undefined */}
                  {groupData.groupdescription && (
                    <div className='group-description-header'>
                      {groupData.groupdescription.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}
                  {userData && userData.value && userData.value.username === groupData.creator_username && (
                    <button onClick={handleEditDescription}>Edit Description</button>
                  )}
                </div>
              )}
            </React.Fragment>
          )}
          {editingDescription && (
            <div className='edit-description'>
              <textarea
                value={newDescription}
                onChange={handleDescriptionChange}
                rows={10}
                maxLength={500}
                placeholder="Enter new description..."
              />
              <div>
                <div className='edit-description-buttons'>
                  <button onClick={handleSaveDescription}>Save</button>
                  <button onClick={() => setEditingDescription(false)}>Cancel</button>
                </div>

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
                                    <span className="member-name" onClick={() => navigateToPublicProfile(member.username)}>
                                        {member.username}
                                        {groupData && member.username === groupData.creator_username && (
                                            <React.Fragment>
                                                <span className="owner-tag">Owner</span>
                                                {groupData.joined_date && (
                                                    <span className="member-joined-date">{formatDate(member.joined_date)}</span>
                                                )}
                                                {userData.value.username === member.username && (
                                                    <div className="leaveGroup">
                                                        <button onClick={() => handleLeaveGroup(member.username)}>Leave Group</button>
                                                    </div>
                                                )}
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
                    {groupData && userData.value && userData.value.username && groupData.creator_username === userData.value.username && (
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
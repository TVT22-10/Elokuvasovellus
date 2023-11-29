import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import './create_group.css';
import { jwtToken } from "../../../components/Signals";

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleDescriptionChange = (e) => {
    if (e.key === 'Enter') {
      setGroupDescription(prevDescription => prevDescription + '\n');
      e.preventDefault();
    }
  };

  const createNewGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3001/groups/create',
        { groupname: groupName, groupdescription: groupDescription },
        { headers: { Authorization: `Bearer ${jwtToken.value}` } }
      );
      setSuccess(true);
      setError(null);
      // Redirect to the search_groups page
      navigate('/search_groups'); // Redirect user
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Error creating group. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="create_group">
      <div className="label-name">
        <h2>Create group</h2>
      </div>
      <form onSubmit={createNewGroup}>
        <div className="group_container">
          <div className="group-name">
            <label htmlFor="group_name">Group name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              id="group_name"
              name="group_name"
            />
          </div>
          <div className="group-description">
            <label htmlFor="group_description">Description:</label>
            <textarea
              id="group_description"
              name="group_description"
              rows={15}
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              onKeyDown={handleDescriptionChange}
            ></textarea>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Group created successfully!</p>}
        <div className="new-group">
          <button id="new_group" type="submit">Create new group</button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;

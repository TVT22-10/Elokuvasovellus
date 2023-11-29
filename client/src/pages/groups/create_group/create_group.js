import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './create_group.css';
import { jwtToken } from "../../../components/Signals";


function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDescriptionChange = (e) => {
    if (e.key === 'Enter') {
      setGroupDescription((prevDescription) => prevDescription + '\n');
      e.preventDefault(); // Prevent the default Enter behavior
    }
  };

  const createNewGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/groups/create',
        {
          groupname: groupName,
          groupdescription: groupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
        }
      );
      console.log('Group created:', response.data);
      setSuccess(true);
      // Redirect or perform any other action upon successful creation
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Error creating group.');
      // Handle error scenarios
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
              rows={15} // Set the number of rows
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              onKeyDown={handleDescriptionChange}
            ></textarea>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Group created successfully!</p>}
        <div className="new-group">
          <Link to="/group_page">
          <button id="new_group">Create new group</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;

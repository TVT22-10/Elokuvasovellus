import React from 'react';
import './create_group.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function CreateGroup() {

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleDescriptionChange = (e) => {
    if (e.key === 'Enter') {
      setGroupDescription((prevDescription) => prevDescription + '\n');
      e.preventDefault(); // Prevent the default Enter behavior
    }
  };


  function CreateNewGroup(e) {
    e.preventDefault();
  }


  return (
    <div className="create_group">
      <div className="label-name">
        <h2>Create group</h2>
      </div>
      <form onSubmit={CreateNewGroup}>
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
        <div className="new-group">
          <Link to ="/group_page">
          <button id="new_group">Create new group</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
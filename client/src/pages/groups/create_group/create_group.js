import React from 'react';
import './create_group.css';


function CreateGroup() {
  return (
    <div className="create_group">
      <div className="label-container">
        <h4>Hae ryhmiä</h4>
        <input type="text" id="username" name="username" />
      </div>
      <h2>Omat ryhmäni</h2>
      <div className="new-group">
      <button id="new_group">Create new group</button>
    </div>
    </div>
  );
}

export default CreateGroup;

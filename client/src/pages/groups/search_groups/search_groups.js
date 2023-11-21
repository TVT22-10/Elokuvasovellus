import React from 'react';
import './search_groups.css';
import { Link } from 'react-router-dom';


function SearchGroups() {
  return (
    <div className="groups">
      <div className="label-name">
        <h2>Search groups</h2>
      </div>
      <div className="search-label">
        <input type="text" id="group_name" name="group_name" />
      </div>
      <div className="new-group">
        <Link to ="/create_group">
      <button id="new_group">Create new group</button>
    </Link>
    </div>
      <div className="my-groups">
      <h2>My groups:</h2>
      </div>
  
    </div>
  );
}

export default SearchGroups;

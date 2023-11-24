import React, { useState, useEffect } from 'react';
import './search_groups.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


function SearchGroups() {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        // Replace 'currentUsername' with the actual logged-in user's username
        const response = await axios.get(`http://localhost:3001/api/user/currentUsername/groups`);
        setUserGroups(response.data);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

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
        {userGroups.length > 0 ? (
          userGroups.map(group => (
            <div key={group.group_id}>
              <Link to={`/groups/group_page/${group.group_id}`}>
                {group.groupname}
              </Link>
            </div>
          ))
        ) : (
          <p>You are not a member of any groups.</p>
        )}
      </div>
    </div>
  );
}

export default SearchGroups;

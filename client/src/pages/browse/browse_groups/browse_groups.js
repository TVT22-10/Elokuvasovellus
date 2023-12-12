import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BrowseGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/groups/all')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  }, []);

  return (
    <div className="browse-groups">
      <h2>Browse Groups</h2>
      <div className="groups-list">
        {groups.length > 0 ? (
          groups.map(group => (
            <div key={group.group_id} className="group-item">
                <h3>{group.groupname}</h3>
                <p>{group.groupdescription}</p>
            </div>
          ))
        ) : (
          <p>No groups available.</p>
        )}
      </div>
    </div>
  );
}

export default BrowseGroups;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './browse_groups.css';

function BrowseGroups() {
  const [groups, setGroups] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState(9); // Set to 9 initially

  useEffect(() => {
    axios.get('http://localhost:3001/groups/all')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  }, []);

  const handleLoadMore = () => {
    setDisplayedGroups(displayedGroups + 9);
  };

  return (
    <div className="browse-groups">
      <h2>Browse Groups</h2>
      <div className="groups-list">
        {groups.length > 0 ? (
          groups.slice(0, displayedGroups).map(group => (
            <Link to={`/groups/${group.group_id}`} key={group.group_id} className="group-link">
              <div className="group-item">
                <h3>{group.groupname}</h3>
                <p>
                  <strong>Description:</strong> {group.groupdescription}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No groups available.</p>
        )}
      </div>

      {displayedGroups < groups.length && (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}

export default BrowseGroups;

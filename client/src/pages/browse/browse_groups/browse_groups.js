// BrowseGroups.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './browse_groups.css';

function BrowseGroups() {
  const [groups, setGroups] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState(9); // Set to 9 initially
  const [searchQuery, setSearchQuery] = useState('');
  const [readMoreMode, setReadMoreMode] = useState(true);

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
    setReadMoreMode(false); // Switch to "Read Less" mode
  };

  const handleReadLess = () => {
    setDisplayedGroups(9);
    setReadMoreMode(true); // Switch back to "Read More" mode
  };

  return (
    <div className="browse-groups">
      <h2>Browse Groups</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by group name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setSearchQuery('')}>Clear</button>
      </div>

      <div className="groups-list">
        {groups
          .filter((group) => group.groupname.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, displayedGroups)
          .map(group => (
            <Link to={`/groups/${group.group_id}`} key={group.group_id} className="group-link">
              <div className="group-item">
                <h3>{group.groupname}</h3>
                <p>
                  <strong>Description:</strong> {group.groupdescription}
                </p>
              </div>
            </Link>
          ))}
      </div>

      {(displayedGroups < groups.length || !readMoreMode) && (
        <button className="load-more-button" onClick={readMoreMode ? handleLoadMore : handleReadLess}>
          {readMoreMode ? 'Load More' : 'Load Less'}
        </button>
      )}
    </div>
  );
}

export default BrowseGroups;

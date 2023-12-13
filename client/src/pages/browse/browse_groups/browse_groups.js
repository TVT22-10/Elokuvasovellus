import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './browse_groups.css';

function BrowseGroups() {
  const [groups, setGroups] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Set the default to 'newest'
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
    setReadMoreMode(false);
  };

  const handleReadLess = () => {
    setDisplayedGroups(9);
    setReadMoreMode(true);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortGroups = (groupsToSort) => {
    switch (sortBy) {
      case 'oldest':
        return groupsToSort.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'newest':
        return groupsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return groupsToSort;
    }
  };

  const sortedGroups = sortGroups(groups);

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

      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="newest">Newest Group</option>
          <option value="oldest">Oldest Group</option>
        </select>
      </div>

      <div className="groups-list">
        {sortedGroups
          .filter((group) => group.groupname.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, displayedGroups)
          .map(group => (
            <Link to={`/groups/${group.group_id}`} key={group.group_id} className="group-link">
              <div className="group-item">
                <h3>
                  <span className="group-name-label">Group Name: </span>
                  <span style={{ color: '#007bff' }}>{group.groupname}</span>
                </h3>
                <p>
                  <strong>Description:</strong> {group.groupdescription}
                </p>
                <p>
                  <strong>Creation Time:</strong> {new Date(group.created_at).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
      </div>

      {(displayedGroups < sortedGroups.length || !readMoreMode) && (
        <button className="load-more-button" onClick={readMoreMode ? handleLoadMore : handleReadLess}>
          {readMoreMode ? 'Load More' : 'Load Less'}
        </button>
      )}
    </div>
  );
}

export default BrowseGroups;

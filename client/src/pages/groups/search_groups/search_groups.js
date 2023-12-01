import React, { useState, useEffect } from 'react';
import './search_groups.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtToken, userData } from '../../../components/Signals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';



function SearchGroups() {
  const [userGroups, setUserGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]); // Define the allGroups state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (jwtToken.value) {
      axios.get(`http://localhost:3001/user/groups`, {
        headers: { Authorization: `Bearer ${jwtToken.value}` }
      })
        .then(response => {
          setUserGroups(response.data);
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
        });
    }
  }, [jwtToken.value]); // Depend on jwtToken.value to re-run


  // Fetching all groups
  useEffect(() => {
    axios.get(`http://localhost:3001/groups/all`)
      .then(response => {
        setAllGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching all groups:', error);
      });
  }, []); // Empty dependency array to run only once


  return (
    <div className="groups">
      <div className="label-name">
        <h2>Search groups</h2>
      </div>
      <div className="new-group">
        <Link to="/create_group">
          <button id="new_group">Create new group</button>
        </Link>
      </div>
      <div className="group-sections">
        <div className="my-groups">
          <h2>My groups:</h2>
          <div className="group-list">
            {userGroups.length > 0 ? (
              userGroups.map(group => (
                <div key={group.group_id} className="group-item">
                  <Link to={`/groups/${group.group_id}`}>
                    {group.groupname}
                  </Link>
                  {group.is_owner && (
                    <FontAwesomeIcon icon={faCrown} style={{ color: "#ffd500", marginLeft: "5px" }} />
                  )}
                </div>
              ))
            ) : (
              <p>You are not a member of any groups.</p>
            )}
          </div>
        </div>
        <div className="all-groups">
          <h2>All groups:</h2>
          <div className="group-list">
            {allGroups.length > 0 ? (
              allGroups.map(group => (
                <div key={group.group_id} className="group-item">
                  <Link to={`/groups/${group.group_id}`}>
                    {group.groupname}
                  </Link>
                  {group.is_owner && (
                    <FontAwesomeIcon icon={faCrown} style={{ color: "#ffd500", marginLeft: "5px" }} />
                  )}

                </div>
              ))
            ) : (
              <p>No groups available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchGroups;
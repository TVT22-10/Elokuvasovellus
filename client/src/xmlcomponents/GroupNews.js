// GroupNews.js
import React, { useState, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import axios from 'axios';
import './GroupNews.css'

const GroupNews = ({ title, description, articleUrl, imageUrl, onAddToGroup, groupId }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [groupNews, setGroupNews] = useState([]);

  useEffect(() => {
    const fetchGroupNews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/groups/${groupId}/news`);
        setGroupNews(response.data);
      } catch (error) {
        console.error('Error fetching group news:', error);
      }
    };

    if (selectedGroup) {
      fetchGroupNews();
    }
  }, [selectedGroup, groupId]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleAddToGroup = () => {
    if (selectedGroup) {
      onAddToGroup(selectedGroup);
      setSelectedGroup(null);
      setShowDropdown(false);
    }
  };

  // make the news image url appear in the group page news section
  // for now the debug says that the image url is undefined
  
  return (
    <div className='group-news-item2'>
    <div className="news-item">
      <a href={articleUrl} target="_blank" rel="noopener noreferrer">
        <strong className="news-title">{title || 'No title'}</strong>
      </a>
      <br />
      <span className="news-description">{description || 'No description'}</span>
      <br />
      {imageUrl && <img src={imageUrl} alt={`Image for ${title}`} className="news-image" />}

      {groupNews.length > 0 && (
        <div className="group-news-list">
          <h4>Group News:</h4>
          <ul>
            {groupNews.map((newsItem) => (
              <li key={newsItem.id}>
                <a href={newsItem.articleUrl} target="_blank" rel="noopener noreferrer">
                  {newsItem.title}
                </a>
                {/* Add more details as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="add-to-group-button" onClick={() => setShowDropdown(!showDropdown)}>
        {/* Add any additional content or styling for the button */}
      </div>
      {showDropdown && (
        <DropdownMenu onSelect={handleGroupChange} />
      )}
      {showDropdown && (
        <button className="add-to-group-button" onClick={handleAddToGroup}>
          Confirm
        </button>
      )}
    </div>
    </div>
  );
};

export default GroupNews;

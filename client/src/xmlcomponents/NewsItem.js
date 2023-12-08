// NewsItem.js
import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import axios from 'axios';

const NewsItem = ({ item, groups, jwtToken }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddToGroup = async (groupId) => {
    try {
      const response = await axios.post(`http://localhost:3001/groups/${groupId}/news`, {
        title: item.Title,
        description: item.HTMLLead,
        articleUrl: item.ArticleURL,
        imageUrl: item.ImageURL,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,  // Add your authentication token
        },
      });

      console.log('News added to group:', response.data);
      // Handle success as needed
      setShowDropdown(false);
    } catch (error) {
      console.error('Error adding news to group:', error);
      // Handle error as needed
    }
  };

  return (
    <li className="news-item">
      <a href={articleUrl} target="_blank" rel="noopener noreferrer">
        <strong className="news-title">{title || 'No title'}</strong>
      </a>
      <br />
      <span className="news-description">{description || 'No description'}</span>
      <br />
      {imageUrl && <img src={imageUrl} alt={`Image for ${title}`} className="news-image" />}

      <div className="add-to-group-button" onClick={() => setShowDropdown(!showDropdown)}>
        Add to Group
      </div>
      {showDropdown && (
        <DropdownMenu groups={groups} onSelect={(group) => handleAddToGroup(group)} />
      )}
    </li>
  );
};

export default NewsItem;

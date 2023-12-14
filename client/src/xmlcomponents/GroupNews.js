// GroupNews.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupNews.css'

const GroupNews = ({ title, description, articleUrl, imageUrl, onAddToGroup, groupId }) => {
  const [selectedGroup] = useState(null);
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

  
  return (
    <div className='group-news-item2'>
    <div className="news-item">
      <a href={articleUrl} target="_blank" rel="noopener noreferrer">
        <strong className="news-title">{title || 'No title'}</strong>
      </a>
      <br />
      <span className="news-description">{description || 'No description'}</span>
      <br />
      <img src={imageUrl} alt={`${title}`} className="news-image" />

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

 
    
    </div>
    </div>
  );
};

export default GroupNews;

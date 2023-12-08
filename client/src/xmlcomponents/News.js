// NewsPage.js
import { jwtToken, userData } from "../components/Signals";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import { useNavigate } from 'react-router-dom';
import './NewsPage.css';
import DropdownMenu from './DropdownMenu';
import GroupNews from './GroupNews';

function NewsPage() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    // Fetch user groups when the component mounts
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/groups', {
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
        });
        setUserGroups(response.data);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

  useEffect(() => {
    // Fetch news data when the component mounts
    const getXml = async () => {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/News/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true,
        });

        const jsResult = await parser.parseStringPromise(result.data);
        const newsItems = jsResult.News.NewsArticle;

        setNewsData(Array.isArray(newsItems) ? newsItems : [newsItems]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing news XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, []);

  const handleAddToGroup = async (itemIndex, groupId) => {
    try {
      const selectedItem = filteredNews[itemIndex]; // Get the selected news item
      const response = await axios.post(`http://localhost:3001/groups/${groupId}/news`, {
        title: selectedItem.Title,
        description: selectedItem.HTMLLead,
        articleUrl: selectedItem.ArticleURL,
        imageUrl: selectedItem.ImageURL,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`,  // Add your authentication token
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

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId === 'all' ? null : selectedCategoryId);
  };

  const filteredNews = selectedCategory
    ? newsData.filter((item) => {
      const itemCategories = Array.isArray(item.Categories.NewsArticleCategory)
        ? item.Categories.NewsArticleCategory
        : [item.Categories.NewsArticleCategory];
      return itemCategories.some((category) => category.ID === selectedCategory);
    })
    : newsData;

  return (
    <div className="news-container">
      <h1>News From Finnkino</h1>
      <p>The news are in Finnish</p>

      <div className="custom-dropdown">
        <span className="dropdown-icon">▼</span>
        <select onChange={handleCategoryChange} value={selectedCategory || 'all'}>
          <option value="all">All Categories 🌐</option>
          <option value="1073">Ajankohtaista 📅</option>
          <option value="1079">Leffauutiset 🎬</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="news-list">
          {filteredNews.map((item, index) => {
            const { Title, HTMLLead, ArticleURL, ImageURL } = item;

            console.log(`Debug: News item ${index + 1}`);
            console.log('Title:', Title);
            console.log('HTMLLead:', HTMLLead);
            console.log('ArticleURL:', ArticleURL);
            console.log('ImageURL:', ImageURL);

            return (
              <GroupNews 
                key={index} 
                title={Title} 
                description={HTMLLead} 
                articleUrl={ArticleURL} 
                imageUrl={ImageURL} 
                onAddToGroup={(groupId) => handleAddToGroup(index, groupId)} 
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NewsPage;

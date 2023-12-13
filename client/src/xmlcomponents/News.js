// news.js
import { jwtToken } from "../components/Signals";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './NewsPage.css';
import NewsItem from './NewsItem';


function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);


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
  }, []); // Empty dependency array to run only once when the component mounts

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
          <option value="all">
            <span role="img" aria-label="All Categories">All Categories 🌐</span>
          </option>
          <option value="1073">
            <span role="img" aria-label="Current Affairs">Ajankohtaista 📅</span>
          </option>
          <option value="1079">
            <span role="img" aria-label="Movie News">Leffauutiset 🎬</span>
          </option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="news-list">
          {filteredNews.map((item, index) => {
            return (
              <NewsItem
                key={index}
                item={item}
                groups={userGroups}
                jwtToken={jwtToken.value}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                dropdownIndex={index}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NewsPage;
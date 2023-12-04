import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './NewsPage.css';

function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
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
          <option value="all">All Categories 🌐</option>
          <option value="1073">Ajankohtaista 📅</option>
          <option value="1079">Leffauutiset 🎬</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="news-list">
          {filteredNews.map((item, index) => (
            <li key={index} className="news-item">
              <a href={item.ArticleURL} target="_blank" rel="noopener noreferrer">
                <strong className="news-title">{item.Title || 'No title'}</strong>
              </a>
              <br />
              <span className="news-description">{item.HTMLLead || 'No description'}</span>
              <br />
              {item.ImageURL && <img src={item.ImageURL} alt={`Image for ${item.Title}`} className="news-image" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsPage;

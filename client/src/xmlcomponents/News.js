import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './NewsPage.css'; // Import the CSS file


function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/News/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true
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

  return (
    <div className="news-container">
      <h1>News</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="news-list">
          {newsData.map((item, index) => (
            <li key={index} className="news-item">
              <strong className="news-title">{item.Title || 'No title'}</strong>
              <br />
              <span className="news-description">{item.HTMLLead || 'No description'}</span>
              <br />
              {item.ImageURL && (
                <img src={item.ImageURL} alt={item.Title} className="news-image" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsPage;

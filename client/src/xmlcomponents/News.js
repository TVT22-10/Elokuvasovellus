import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getXml = async () => {
      try {
        // Replace with your actual news XML URL
        const result = await axios.get('https://www.finnkino.fi/xml/News/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          // Adjust these options based on the news XML structure
          explicitRoot: true,
          mergeAttrs: true
        });

        const jsResult = await parser.parseStringPromise(result.data);
        // Adjust this line based on the structure of your news XML
        const newsItems = jsResult.News.NewsItem;

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
    <div>
      <h1>News</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {newsData.map((item, index) => (
            <li key={index}>
              <strong>Title:</strong> {item.Title}
              <br />
              <strong>Description:</strong> {item.Description}
              {/* Add other fields as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsPage;

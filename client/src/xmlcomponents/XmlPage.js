// XmlPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

function XmlPage({ xmlUrl, topLevelProperty, nestedProperty, itemNameKey }) {
  const [xmlData, setXmlData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get(xmlUrl);
        console.log('XML Response:', result.data); // Log the entire XML response

        const jsResult = await xml2js.parseStringPromise(result.data);
        console.log('Parsed XML data:', jsResult); // Log the entire object

        // Verify data structure before setting state
        if (jsResult && jsResult[topLevelProperty]) {
          if (nestedProperty) {
            setXmlData(jsResult[topLevelProperty][nestedProperty]);
          } else {
            setXmlData(jsResult[topLevelProperty]);
          }
        } else {
          console.error('Invalid XML data structure:', jsResult);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, [xmlUrl, topLevelProperty, nestedProperty]);

  return (
    <div>
      <h1>XML Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Number of items: {xmlData.length}</p>
          <ul>
            {xmlData.map((item, index) => (
              <li key={index}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  
}

export default XmlPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

function XmlPage({ xmlUrl, topLevelProperty, nestedProperty }) {
  const [xmlData, setXmlData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNestedProperty = (data, property) => {
    // Check if the property is present and has data
    return data && data[property] ? data[property] : [];
  };

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get(xmlUrl);
        console.log('XML Response:', result.data); // Log the entire XML response
    
        const jsResult = await xml2js.parseStringPromise(result.data, {
          explicitArray: false,
          explicitRoot: false,
          mergeAttrs: true,
          xmlns: true,
        });
        console.log('Parsed XML data:', jsResult); // Log the entire object
    
        // Access the correct nested property
        const topLevelData = getNestedProperty(jsResult, topLevelProperty);
        const nestedData = getNestedProperty(topLevelData, nestedProperty);
        setXmlData(Array.isArray(nestedData) ? nestedData : [nestedData]);
    
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing XML data:', error);
        setLoading(false);
      }
    };
    
    getXml();
  }, [xmlUrl, topLevelProperty, nestedProperty]);

  useEffect(() => {
    console.log('XML Data:', xmlData);
  }, [xmlData]);

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
                {Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default XmlPage;

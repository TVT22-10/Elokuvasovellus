// TheatreAreas.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './TheatreAreasPage.css'; // Import the CSS file

function TheatreAreasPage() {
  const [xmlData, setXmlData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getXml() {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/TheatreAreas/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true,
        });

        const jsResult = await parser.parseStringPromise(result.data);

        // Check if TheatreAreas and TheatreArea exist
        if (jsResult.TheatreAreas && jsResult.TheatreAreas.TheatreArea) {
          const theatreAreas = jsResult.TheatreAreas.TheatreArea;
          setXmlData(Array.isArray(theatreAreas) ? theatreAreas : [theatreAreas]);
        } else {
          console.error('TheatreAreas or TheatreArea is not defined in the XML');
          // Handle the case where the data is not in the expected format
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing XML data:', error);
        setLoading(false);
      }
    }

    getXml();
  }, []);

  return (
    <div className="theatre-container">
      <h1 className="theatre-title">Theatre Areas</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="theatre-list">
          {xmlData.map((theatre, index) => (
            <li key={index} className="theatre-item">
              <strong>ID:</strong> {theatre.ID}
              <br />
              <strong>Name:</strong> {theatre.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TheatreAreasPage;

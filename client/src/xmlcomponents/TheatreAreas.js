import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

function TheatreAreasPage() {
  const [xmlData, setXmlData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getXml() {
        try {
          const result = await axios.get('https://www.finnkino.fi/xml/TheatreAreas/');
          const parser = new xml2js.Parser({
            explicitArray: false,
            // Try using explicitRoot: true or remove this line
            explicitRoot: true,
            mergeAttrs: true
          });
      
          const jsResult = await parser.parseStringPromise(result.data);
          console.log(jsResult); // Log the parsed result
      
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
    <div>
      <h1>Theatre Areas</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {xmlData.map((theatre, index) => (
            <li key={index}>
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

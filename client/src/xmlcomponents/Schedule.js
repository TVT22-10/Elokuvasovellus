import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './SchedulePage.css'; // Import the CSS file

function SchedulePage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/Schedule/');
        const jsResult = await xml2js.parseStringPromise(result.data, {
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true,
        });

        const schedule = jsResult.Schedule.Shows.Show;

        setScheduleData(Array.isArray(schedule) ? schedule : [schedule]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing schedule XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, []);

  return (
    <div className="schedule-container">
      <h1>Schedule</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="schedule-list">
          {scheduleData.map((item, index) => (
            <li key={index} className="schedule-item">
              <strong className="schedule-title">{item.Title || 'No title'}</strong>
              <br />
              <span className="schedule-description">{item.PresentationMethod || 'No presentation method'}</span>
              <br />
              {item.Images && item.Images.EventMediumImagePortrait && (
                <img src={item.Images.EventMediumImagePortrait} alt={item.Title} className="schedule-image" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SchedulePage;

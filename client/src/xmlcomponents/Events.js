import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './EventsPage.css'; // Import the CSS file

function EventsPage() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/Events/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true
        });

        const jsResult = await parser.parseStringPromise(result.data);
        const events = jsResult.Events.Event;

        setEventsData(Array.isArray(events) ? events : [events]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing events XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, []);

  return (
    <div className="events-container">
      <h1>Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="events-list">
          {eventsData.map((item, index) => (
            <li key={index} className="events-item">
              <strong className="events-title">{item.Title || 'No title'}</strong>
              <br />
              <span className="events-description">{item.ShortSynopsis || 'No description'}</span>
              <br />
              {item.Images && item.Images.EventMediumImagePortrait && (
                <img src={item.Images.EventMediumImagePortrait} alt={item.Title} className="events-image" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventsPage;

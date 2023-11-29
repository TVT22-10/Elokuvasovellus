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
          {eventsData.map((event, index) => (
            <li key={index} className="event-item">
              <strong className="event-title">{event.Title || 'No title'}</strong>
              <p>
                <strong>Production Year:</strong> {event.ProductionYear}
              </p>
              <p>
                <strong>Length:</strong> {event.LengthInMinutes} minutes
              </p>
              <p>
                <strong>Rating:</strong> {event.Rating}
              </p>
              <p>
                <strong>Genres:</strong> {event.Genres}
              </p>
              <p>
                <strong>Synopsis:</strong> {event.Synopsis}
              </p>
              {event.Images && event.Images.EventMediumImagePortrait && (
                <img
                  src={event.Images.EventMediumImagePortrait}
                  alt={event.Title}
                  className="event-image"
                />
              )}
              <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventsPage;

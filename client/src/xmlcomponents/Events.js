import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './EventsPage.css';

function EventsPage() {
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    productionYear: '',
    rating: '',
    genres: '', // Add genres to search criteria
    globalDistributor: '', // Add global distributor to search criteria
  });

  useEffect(() => {
    const getXml = async () => {
      try {
        const result = await axios.get('https://www.finnkino.fi/xml/Events/');
        const parser = new xml2js.Parser({
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true,
        });

        const jsResult = await parser.parseStringPromise(result.data);
        const events = jsResult.Events.Event;

        setEventsData(Array.isArray(events) ? events : [events]);
        setFilteredEvents(Array.isArray(events) ? events : [events]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing events XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, []);

  const handleSearch = () => {
    const filtered = eventsData.filter(
      (event) =>
        (searchCriteria.productionYear === '' ||
          event.ProductionYear === searchCriteria.productionYear.toString()) &&
        (searchCriteria.rating === '' || event.Rating === searchCriteria.rating) &&
        (searchCriteria.genres === '' ||
          event.Genres.toLowerCase().includes(searchCriteria.genres.toLowerCase())) &&
        (searchCriteria.globalDistributor === '' ||
          event.GlobalDistributorName
            .toLowerCase()
            .includes(searchCriteria.globalDistributor.toLowerCase()))
    );

    setFilteredEvents(filtered);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prevCriteria) => ({ ...prevCriteria, [name]: value }));
  };

  const formatLocalReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="events-container">
      <h1>Events</h1>

      <div className="search-form">
        <label>
          Production Year:
          <input
            type="text"
            name="productionYear"
            value={searchCriteria.productionYear}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Rating:
          <input
            type="text"
            name="rating"
            value={searchCriteria.rating}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Genres:
          <input
            type="text"
            name="genres"
            value={searchCriteria.genres}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Global Distributor:
          <input
            type="text"
            name="globalDistributor"
            value={searchCriteria.globalDistributor}
            onChange={handleInputChange}
          />
        </label>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {filteredEvents.map((event, index) => (
            <div key={index} className="event-item">
              <h2 className="event-title">{event.Title || 'No title'}</h2>
              <p>
                <strong>Production Year:</strong> {event.ProductionYear}
              </p>
              <p>
                <strong>Rating:</strong> {event.Rating}
              </p>
              <p>
                <strong>Genres:</strong> {event.Genres}
              </p>
              <p>
                <strong>Synopsis:</strong> {event.ShortSynopsis}
              </p>
              <p>
                <strong>Global Distributor:</strong> {event.GlobalDistributorName}
              </p>
              <p>
                <strong>Local Release Date:</strong>{' '}
                {formatLocalReleaseDate(event.dtLocalRelease)}
              </p>
              {event.Images && event.Images.EventMediumImagePortrait && (
                <img
                  src={event.Images.EventMediumImagePortrait}
                  alt={event.Title}
                  className="event-image"
                />
              )}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;

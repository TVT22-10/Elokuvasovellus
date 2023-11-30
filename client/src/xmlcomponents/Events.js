import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './EventsPage.css'; // Import the CSS file

function EventsPage() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    productionYear: '',
    rating: '',
    genres: '',
    globalDistributor: '',
  });

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

      <div className="search-form">
        <label>
          Production Year:
          <select
            name="productionYear"
            value={searchCriteria.productionYear}
            onChange={handleInputChange}
          >
            <option value="">All Years</option>
            {eventsData
              .map((event) => event.ProductionYear)
              .filter((year, index, self) => self.indexOf(year) === index)
              .sort((a, b) => b - a) // Sort in descending order
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </label>

        <label>
          Rating:
          <select
            name="rating"
            value={searchCriteria.rating}
            onChange={handleInputChange}
          >
            <option value="">All Ratings</option>
            {eventsData
              .map((event) => event.Rating)
              .filter((rating, index, self) => self.indexOf(rating) === index)
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
          </select>
        </label>

        <label>
          Genres:
          <select
            name="genres"
            value={searchCriteria.genres}
            onChange={handleInputChange}
          >
            <option value="">All Genres</option>
            {eventsData
              .map((event) => event.Genres.split(','))
              .flat()
              .filter((genre, index, self) => self.indexOf(genre) === index)
              .map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
          </select>
        </label>

        <label>
          Global Distributor:
          <select
            name="globalDistributor"
            value={searchCriteria.globalDistributor}
            onChange={handleInputChange}
          >
            <option value="">All Distributors</option>
            {eventsData
              .map((event) => event.GlobalDistributorName)
              .filter((distributor, index, self) => self.indexOf(distributor) === index)
              .map((distributor) => (
                <option key={distributor} value={distributor}>
                  {distributor}
                </option>
              ))}
          </select>
        </label>

        <button onClick={handleSearch}>Search</button>
      </div>

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

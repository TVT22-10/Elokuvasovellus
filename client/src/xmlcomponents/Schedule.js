import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './SchedulePage.css'; // Import the CSS file

function SchedulePage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState({
    selectedRating: '',
    selectedGenre: '',
    selectedTitle: '',
    selectedTheatre: '',
    selectedTheatreAuditorium: '',
    selectedPresentationMethod: '',
  });

  const formatLocalReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const formatShowTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('fi-FI', {
      hour: 'numeric',
      minute: 'numeric',
    });
    return `${formattedDate} ${formattedTime}`;
  };


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
        setFilteredSchedule(Array.isArray(schedule) ? schedule : [schedule]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing schedule XML data:', error);
        setLoading(false);
      }
    };

    getXml();
  }, []);

  const handleSearch = () => {
    const filtered = scheduleData.filter(
      (item) =>
        (filterCriteria.selectedRating === '' || item.Rating === filterCriteria.selectedRating) &&
        (filterCriteria.selectedGenre === '' || item.Genres.includes(filterCriteria.selectedGenre)) &&
        (filterCriteria.selectedTitle === '' || item.Title.includes(filterCriteria.selectedTitle)) &&
        (filterCriteria.selectedTheatre === '' || item.Theatre.includes(filterCriteria.selectedTheatre)) &&
        (filterCriteria.selectedTheatreAuditorium === '' || item.TheatreAuditorium.includes(filterCriteria.selectedTheatreAuditorium)) &&
        (filterCriteria.selectedPresentationMethod === '' || item.PresentationMethod.includes(filterCriteria.selectedPresentationMethod))
    );

    setFilteredSchedule(filtered);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria((prevCriteria) => ({ ...prevCriteria, [name]: value }));
  };

  const getUniqueValues = (key) => {
    return Array.from(new Set(scheduleData.map((item) => item[key])))
      .filter(Boolean)
      .map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ));
  };

  return (
    <div className="schedule-container">
      <h1>Schedule</h1>
      <div className="filter-form">
        <label>
          Rating:
          <select
            name="selectedRating"
            value={filterCriteria.selectedRating}
            onChange={handleInputChange}
          >
            <option value="">All Ratings</option>
            {scheduleData
              .map((item) => item.Rating)
              .filter((rating, index, self) => self.indexOf(rating) === index)
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
          </select>
        </label>

        <label>
          Genre:
          <select
            name="selectedGenre"
            value={filterCriteria.selectedGenre}
            onChange={handleInputChange}
          >
            <option value="">All Genres</option>
            {scheduleData
              .map((item) => item.Genres.split(','))
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
          Title:
          <select
            name="selectedTitle"
            value={filterCriteria.selectedTitle}
            onChange={handleInputChange}
          >
            <option value="">All Titles</option>
            {getUniqueValues('Title')}
          </select>
        </label>

        <label>
          Theatre:
          <select
            name="selectedTheatre"
            value={filterCriteria.selectedTheatre}
            onChange={handleInputChange}
          >
            <option value="">All Theatres</option>
            {getUniqueValues('Theatre')}
          </select>
        </label>

        <label>
          Theatre Auditorium:
          <select
            name="selectedTheatreAuditorium"
            value={filterCriteria.selectedTheatreAuditorium}
            onChange={handleInputChange}
          >
            <option value="">All Auditoriums</option>
            {getUniqueValues('TheatreAuditorium')}
          </select>
        </label>

        <label>
          Presentation Method:
          <select
            name="selectedPresentationMethod"
            value={filterCriteria.selectedPresentationMethod}
            onChange={handleInputChange}
          >
            <option value="">All Methods</option>
            {getUniqueValues('PresentationMethod')}
          </select>
        </label>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="schedule-list">
          {filteredSchedule.map((item, index) => (
            <li key={index} className="schedule-item">
              <strong className="schedule-title">{item.Title || 'No title'}</strong>
              <br />
              <span className="schedule-description">
                {item.PresentationMethod || 'No presentation method'}
              </span>
              <br />
              <span className="schedule-info">Release Year: {item.ProductionYear}</span>
              <br />
              <span className="schedule-info">Length: {item.LengthInMinutes} minutes</span>
              <br />
              <span className="schedule-info">Genres: {item.Genres}</span>
              <br />
              <span className="schedule-info">Rating: {item.Rating}</span>
              <br />
              <span className="schedule-info">Language: {item.SpokenLanguage?.Name || 'Unknown'}</span>
              <br />
              <span className="schedule-info">Subtitle: {item.SubtitleLanguage1?.Name || 'None'}</span>
              <br />
              <span className="schedule-info">Event Type: {item.EventType}</span>
              <br />
              <span className="schedule-info">
                Start Time: {formatShowTime(item.dttmShowStart)}
              </span>
              <br />
              <span className="schedule-info">
                End Time: {formatShowTime(item.dttmShowEnd)}
              </span>
              <br />
              {/* Add more details as needed */}
              <a href={item.ShowURL} target="_blank" rel="noopener noreferrer">
                View Details
              </a>
              <br />
              {item.Images && item.Images.EventMediumImagePortrait && (
                <img
                  src={item.Images.EventMediumImagePortrait}
                  alt={item.Title}
                  className="schedule-image"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SchedulePage;

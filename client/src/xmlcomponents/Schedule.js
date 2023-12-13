import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import './SchedulePage.css';

const SchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState({
    selectedRating: '',
    selectedGenre: '',
    selectedTitle: '',
    selectedTheatre: '',
    selectedPresentationMethod: '',
    selectedTimeInterval: '',
    selectedLanguage: '',
    selectedSubtitle: '',
  });


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
    const getXmlForTheatre = async (theatreAreaId) => {
      try {
        const result = await axios.get(`https://www.finnkino.fi/xml/Schedule/?area=${theatreAreaId}`);
        const jsResult = await xml2js.parseStringPromise(result.data, {
          explicitArray: false,
          explicitRoot: true,
          mergeAttrs: true,
        });

        const schedule = jsResult.Schedule.Shows.Show;
        return Array.isArray(schedule) ? schedule : [schedule];
      } catch (error) {
        console.error('Error fetching or parsing schedule XML data:', error);
        return [];
      }
    };

    const getAllSchedules = async () => {
      const theatreAreas = [
        1014, 1018, 1015, 1016, 1017, 1041, 1019, 1034, 1035, 1022, 1046
      ];
      const allSchedules = [];

      for (const areaId of theatreAreas) {
        const scheduleForTheatre = await getXmlForTheatre(areaId);
        allSchedules.push(...scheduleForTheatre);
      }

      setScheduleData(allSchedules);
      setFilteredSchedule(allSchedules);
      setLoading(false);
    };

    getAllSchedules();
  }, []);

  const handleSearch = () => {
    const filtered = scheduleData.filter(
      (item) =>
        (filterCriteria.selectedRating === '' || item.Rating === filterCriteria.selectedRating) &&
        (filterCriteria.selectedGenre === '' || item.Genres.includes(filterCriteria.selectedGenre)) &&
        (filterCriteria.selectedTitle === '' || item.Title.includes(filterCriteria.selectedTitle)) &&
        (filterCriteria.selectedTheatre === '' || item.Theatre === filterCriteria.selectedTheatre) &&
        (filterCriteria.selectedPresentationMethod === '' || item.PresentationMethod.includes(filterCriteria.selectedPresentationMethod)) &&
        (filterCriteria.selectedTimeInterval === '' || handleTimeIntervalFilter(item, filterCriteria.selectedTimeInterval)) &&
        (filterCriteria.selectedLanguage === '' || item.SpokenLanguage?.Name === filterCriteria.selectedLanguage) &&
        (filterCriteria.selectedSubtitle === '' || item.SubtitleLanguage1?.Name === filterCriteria.selectedSubtitle)
    );

    setFilteredSchedule(filtered);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria((prevCriteria) => ({ ...prevCriteria, [name]: value }));
  };

  const handleTimeIntervalFilter = (item, selectedTimeInterval) => {
    if (!selectedTimeInterval) return true;

    const showDate = new Date(item.dttmShowStart);
    const startHour = showDate.getHours();
    const endHour = new Date(item.dttmShowEnd).getHours();

    const [start, end] = selectedTimeInterval.split('-');
    const [startHourFilter, endHourFilter] = [parseInt(start), parseInt(end)];

    return startHour >= startHourFilter && endHour <= endHourFilter;
  };

  const getTimeIntervalsOptions = () => {
    // Assuming movies start every two hours, adjust as needed
    const intervals = Array.from({ length: 24 / 2 }, (_, index) => {
      const startHour = index * 2;
      const endHour = startHour + 2;
      return `${startHour.toString().padStart(2, '0')}.00-${endHour.toString().padStart(2, '0')}.00`;
    });

    return intervals.map((interval) => (
      <option key={interval} value={interval}>
        {interval}
      </option>
    ));
  };

  const getLanguageOptions = () => {
    const languages = Array.from(new Set(scheduleData.map((item) => item.SpokenLanguage?.Name)))
      .filter(Boolean)
      .map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ));

    return [<option key="allLanguages" value="">All Languages</option>, ...languages];
  };

  const getSubtitleOptions = () => {
    const subtitles = Array.from(new Set(scheduleData.map((item) => item.SubtitleLanguage1?.Name)))
      .filter(Boolean)
      .map((subtitle) => (
        <option key={subtitle} value={subtitle}>
          {subtitle}
        </option>
      ));

    return [<option key="allSubtitles" value="">All Subtitles</option>, ...subtitles];
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

        <label>
          Time Interval:
          <select
            name="selectedTimeInterval"
            value={filterCriteria.selectedTimeInterval}
            onChange={handleInputChange}
          >
            <option value="">All Time Intervals</option>
            {getTimeIntervalsOptions()}
          </select>
        </label>

        <label>
          Language:
          <select
            name="selectedLanguage"
            value={filterCriteria.selectedLanguage}
            onChange={handleInputChange}
          >
            {getLanguageOptions()}
          </select>
        </label>

        <label>
          Subtitle:
          <select
            name="selectedSubtitle"
            value={filterCriteria.selectedSubtitle}
            onChange={handleInputChange}
          >
            {getSubtitleOptions()}
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
              <span className="schedule-info">Theatre: {item.Theatre}</span>
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
};

export default SchedulePage;

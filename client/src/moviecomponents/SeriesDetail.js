import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './MovieDetail.css'; // Reusing the same CSS
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function SeriesDetail() {
  const { seriesId } = useParams();
  const [seriesDetails, setSeriesDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const castContainerRef = useRef(null);
  const navigate = useNavigate();
  const [trailerUrl, setTrailerUrl] = useState(''); // State to store trailer URL


  useEffect(() => {
    setLoading(true);

    // Fetch series details
    fetch(`http://localhost:3001/series/${seriesId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch series details.');
        }
        return response.json();
      })
      .then(data => {
        setSeriesDetails(data);

        // Fetch cast details
        return fetch(`http://localhost:3001/series/${seriesId}/cast`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cast details.');
        }
        return response.json();
      })
      .then(castData => {
        setCast(castData.cast);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [seriesId]);

  fetch(`http://localhost:3001/series/${seriesId}/videos`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch trailer.');
    }
    return response.json();
  })
  .then(data => {
    const trailers = data.results.filter(video => video.type === 'Trailer');
    if (trailers.length > 0) {
      setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
    }
    setLoading(false);
  })
  .catch(err => {
    setError(err.message);
    setLoading(false);
  });


  const calculateRating = rating => {
    const circumference = 2 * Math.PI * 20;
    return (rating / 10) * circumference;
  };

  const scrollCast = scrollOffset => {
    castContainerRef.current.scrollLeft += scrollOffset;
  };

  if (loading) {
    return (
      <div className="overlay">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative-container">
      <div className="gradient-overlay"></div>

      <div className="background-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${seriesDetails.backdrop_path})` }}></div>

      <div className="movie-content">
        <div className="poster-and-trailer-container">
          <img src={`https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`} alt={seriesDetails.name} className="movie-poster" />

          {/* Trailer Section */}
          {trailerUrl && (
            <div className="trailer-container">
              <iframe
                src={trailerUrl}
                title="Movie Trailer"
                allowFullScreen
                className="movie-trailer-iframe">
              </iframe>
            </div>
          )}
        
        </div>

        <div className="movie-detail-content">
          <h1 className="detail-title">{seriesDetails.name}</h1>
          <p className="detail-release-date">{seriesDetails.first_air_date.split('-')[0]}</p>

          <div className="detail-flex-container">
            <div className="movie-rating-circle">
              <svg width="60" height="60" viewBox="0 0 44 44">
                <circle className="rating-circle-bg" cx="22" cy="22" r="20" />
                <circle className="rating-circle" cx="22" cy="22" r="20" strokeDasharray={`${calculateRating(seriesDetails.vote_average)} 999`} />
                <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="rating-text">
                  {seriesDetails.vote_average.toFixed(1)}
                </text>
              </svg>
            </div>

            <div className="genres-container">
              {seriesDetails.genres && seriesDetails.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <p>{seriesDetails.overview}</p>

          <div className="cast-section">
            <h2 className="cast-heading">CAST</h2>

            <button onClick={() => scrollCast(-300)} className="cast-scroll-button left-arrow">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div ref={castContainerRef} className="cast-container">
              {cast.map(member => (
                <div key={member.id} className="cast-member" onClick={() => navigate(`/actors/${member.id}`)}>
                  <div className="cast-poster-wrapper">
                    {member.profile_path && (
                      <img src={`https://image.tmdb.org/t/p/w200${member.profile_path}`} alt={member.name} className="cast-poster" />
                    )}
                    <div className="cast-info">
                      <p className="cast-name">{member.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollCast(300)} className="cast-scroll-button right-arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SeriesDetail;

import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/Contexts'; // Adjust the path as necessary 
import axios from 'axios';
import './MovieDetail.css';
import './LoadingScreen.css';
import MovieReviews from '../pages/movie_review/movie_review'; 

function MovieDetail() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const castContainerRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Fetch movie details
    fetch(`http://localhost:3001/movies/${movieId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        return response.json();
      })
      .then(data => {
        setMovieDetails(data);

        // Fetch cast details
        return fetch(`http://localhost:3001/movies/${movieId}/cast`);
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
  }, [movieId]);

  const calculateRating = rating => {
    const circumference = 2 * Math.PI * 20;
    return (rating / 10) * circumference;
  };

  const scrollCast = scrollOffset => {
    castContainerRef.current.scrollLeft += scrollOffset;
  };

  const addToFavorites = async () => {
    try {
      // Replace 'username' with the actual username of the logged-in user
      const username = 'username';
      
      const response = await axios.post(`http://localhost:3001/favorites/${username}`, { movieId });
      
      console.log(response.data);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
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

      <div className="background-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})` }}></div>

      <div className="movie-content">
        <img src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} alt={movieDetails.title} className="movie-poster" />

        <div className="movie-detail-content">
          <h1 className="detail-title">{movieDetails.title}</h1>
          <p className="detail-release-date">{movieDetails.release_date.split('-')[0]}</p>

          <div className="detail-flex-container">
            <div className="movie-rating-circle">
              <svg width="60" height="60" viewBox="0 0 44 44">
                <circle className="rating-circle-bg" cx="22" cy="22" r="20" />
                <circle className="rating-circle" cx="22" cy="22" r="20" strokeDasharray={`${calculateRating(movieDetails.vote_average)} 999`} />
                <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="rating-text">
                  {movieDetails.vote_average.toFixed(1)}
                </text>
              </svg>
            </div>

            <div className="genres-container">
              {movieDetails.genres && movieDetails.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <p>{movieDetails.overview}</p>

          {/* Add to Favorites button */}
          {isLoggedIn && (
            <button className="favorite-button" onClick={addToFavorites}>Add to Favorites</button>
          )}

          <div className="cast-section">
            <h2 className="cast-heading">CAST</h2>

            <button onClick={() => scrollCast(-300)} className="cast-scroll-button left-arrow">&lt;</button>
            <div ref={castContainerRef} className="cast-container">
              {cast.map(member => (
                <div key={member.id} className="cast-member">
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
            <button onClick={() => scrollCast(300)} className="cast-scroll-button right-arrow">&gt;</button>
          </div>

         {/* Reviews section */}
       <MovieReviews movieId={movieId} />
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;

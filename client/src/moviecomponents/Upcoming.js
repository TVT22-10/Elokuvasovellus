import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieStyles.css'; // Assuming you are reusing the same styles

function Upcoming() {
  const [movies, setMovies] = useState([]);
  const movieContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/upcoming') // Endpoint for top-rated movies
      .then(response => response.json())
      .then(data => setMovies(data.results))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const navigateToMovie = (movieId) => {
    navigate(`/movies/${movieId}`);
  };
  
  const scroll = (scrollOffset) => {
    movieContainerRef.current.scrollLeft += scrollOffset;
  };

  const calculateRating = (rating) => {
    const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
    return (rating / 10) * circumference; // Convert to length of the circle's stroke
  };

  return (
    <div className="movie-section">
      <button onClick={() => scroll(-300)} className="scroll-button left-arrow">&lt;</button>
      <div ref={movieContainerRef} className="movie-container">
        {movies.map(movie => (
          <div key={movie.id} className="movie" onClick={() => navigateToMovie(movie.id)}>
            <div className="movie-poster-wrapper">
              <img 
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="movie-info">
              <div className="movie-rating-circle">
              <svg width="40" height="40" viewBox="0 0 44 44">
                <circle 
                  className="rating-circle-bg" 
                  cx="22" cy="22" r="20" 
                />
                <circle 
                  className="rating-circle" 
                  cx="22" cy="22" r="20" 
                  strokeDasharray={`${calculateRating(movie.vote_average)} 999`}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  dy=".3em" /* Adjust this value as needed */
                  textAnchor="middle"
                  className="rating-text"
                  >
                  {movie.vote_average.toFixed(1)}
                  </text>

              </svg>
            </div>
                <p className="movie-release-date">Released: {movie.release_date}</p>
                <h3 className="movie-title">{movie.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll(300)} className="scroll-button right-arrow">&gt;</button>
    </div>
  );
}

export default Upcoming;

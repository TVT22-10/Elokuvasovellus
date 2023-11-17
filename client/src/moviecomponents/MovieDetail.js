import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';



function MovieDetail() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [cast, setCast] = useState([]); // Add this line to define cast and setCast
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const castContainerRef = useRef(null);

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
        setCast(castData.cast); // Assuming the data has a 'cast' array
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

  }, [movieId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const calculateRating = (rating) => {
    const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
    return (rating / 10) * circumference; // Convert to length of the circle's stroke
  };

  const scrollCast = (scrollOffset) => {
    castContainerRef.current.scrollLeft += scrollOffset;
  };
  

  return (
    <div className="relative-container">
  {/* Pseudo-element for gradient */}
  <div className="gradient-overlay"></div>




  {/* Background image */}
  <div 
  className="background-image"
  style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})` }}
>
  
</div>

  
      {/* Movie details content on top of the background */}
      <div className="movie-content">
        {/* Movie poster */}
        <img 
  src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} 
  alt={movieDetails.title} 
  className="movie-poster"
/>

          <div className="movie-detail-content">

          <h1 className="detail-title">{movieDetails.title}</h1>
<p className="detail-release-date">
  {movieDetails.release_date.split('-')[0]}
</p>
<div className="detail-flex-container">
{/* Rating Circle */}
    <div className="movie-rating-circle">
      <svg width="60" height="60" viewBox="0 0 44 44">
        <circle 
          className="rating-circle-bg" 
          cx="22" cy="22" r="20" 
        />
        <circle 
          className="rating-circle" 
          cx="22" cy="22" r="20" 
          strokeDasharray={`${calculateRating(movieDetails.vote_average)} 999`}
        />
        <text 
          x="50%" 
          y="50%" 
          dy=".3em" /* Adjust this value as needed */
          textAnchor="middle"
          className="rating-text"
        >
          {movieDetails.vote_average.toFixed(1)}
        </text>
      </svg>
    </div>
    {/* Genres */}
<div className="genres-container">
  {movieDetails.genres && movieDetails.genres.map((genre, index) => (
    <span key={index} className="genre-tag">
      {genre.name}
    </span>
  ))}
</div>


        </div>      
    <p>{movieDetails.overview}</p>
          {/* Cast section */}
<div className="cast-section">
<h2 className="cast-heading">CAST</h2> {/* Heading for the cast section */}

  <button onClick={() => scrollCast(-300)} className="cast-scroll-button left-arrow">&lt;</button>
  <div ref={castContainerRef} className="cast-container">
    {cast.map(member => (
      <div key={member.id} className="cast-member">
        <div className="cast-poster-wrapper">
          {member.profile_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w200${member.profile_path}`} 
              alt={member.name} 
              className="cast-poster"
            />
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

    
  </div>
</div>

    </div>
  );
}

export default MovieDetail;

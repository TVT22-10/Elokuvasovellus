import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Cast.css';


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

  const movieContentStyle = {
    display: 'flex',
    padding: '150px 100px 0 100px', // Padding on top, right, bottom (0), and left
    position: 'relative',
    zIndex: 1,
    height: '90vh' // Adjust the height as needed
  };

  const moviePosterStyle = {
    maxWidth: '780px', // Sets the maximum width
    padding: '0 20px 0 0', // Padding on top, right, bottom, left (0)
    height: 'auto', // Adjusts the height automatically to maintain aspect ratio
    marginRight: '20px', // Space between poster and details
    objectFit: 'contain' // Maintains the aspect ratio of the image
  };
  
  const calculateRating = (rating) => {
    const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
    return (rating / 10) * circumference; // Convert to length of the circle's stroke
  };

  const scrollCast = (scrollOffset) => {
    castContainerRef.current.scrollLeft += scrollOffset;
  };
  

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
  {/* Pseudo-element for gradient */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%)`,
    zIndex: 1, // Ensure this is above the background image
  }}></div>

  {/* Background image */}
  <div style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundAttachment: 'fixed',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
    zIndex: -1,
  }}></div>
  
      {/* Movie details content on top of the background */}
      <div style={movieContentStyle}>
        {/* Movie poster */}
        <img 
          src={`https://image.tmdb.org/t/p/w780${movieDetails.poster_path}`} 
          alt={movieDetails.title} 
          style={moviePosterStyle}
        />
        <div>
        <h1 style={{ fontSize: '66px', margin: '0 0 10px 0' }}>{movieDetails.title}</h1> {/* Reset margin for h1 */}        
        <p style={{ fontSize: '33px' }}>
         {movieDetails.release_date.split('-')[0]}
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
    <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '20px' }}>
  {movieDetails.genres && movieDetails.genres.map((genre, index) => (
    <span key={index} style={{
      background: '#007bff', // Light grey background; adjust as needed
      borderRadius: '20px', // Rounded corners
      padding: '5px 10px', // Padding inside the box
      marginRight: '10px', // Space between boxes
      marginBottom: '10px', // Space below each box, for when they wrap
      fontSize: '14px', // Smaller font size; adjust as needed
      height: '20px', // Fixed height for the box

    }}>
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

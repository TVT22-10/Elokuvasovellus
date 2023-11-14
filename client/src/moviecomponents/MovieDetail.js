import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/movies/${movieId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        return response.json();
      })
      .then(data => {
        setMovieDetails(data);
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

  return (
    <div style={{ position: 'relative', height: '100vh' }}> {/* Adjust height as needed */}
      {/* Background image with gradient opacity */}
      <div style={{
        backgroundImage: `
          linear-gradient(
            to top, 
            rgba(0, 0, 0, 1) 0%, 
            rgba(0, 0, 0, 0.7) 50%, 
            rgba(0, 0, 0, 0) 100%
          ),
          url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60%',
        zIndex: -1, // Places the background behind the content
      }} />
  
      {/* Movie details content on top of the background */}
      <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        <h1>{movieDetails.title}</h1>
        <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
        <p><strong>Rating:</strong> {movieDetails.vote_average}/10</p>
        <p><strong>Overview:</strong> {movieDetails.overview}</p>
        
        {/* Movie poster */}
        <img 
          src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`} 
          alt={movieDetails.title} 
          style={{ width: '300px', margin: '20px' }}
        />
        {/* ... other details ... */}
      </div>
    </div>
  );
  
  
  
}

export default MovieDetail;

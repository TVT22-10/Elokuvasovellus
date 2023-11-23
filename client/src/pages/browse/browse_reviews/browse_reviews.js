import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './browse_reviews.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


function BrowseReviews() {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate


  const navigateToMovie = (movieId) => {
    navigate(`/movies/${movieId}`);
};
  useEffect(() => {
    axios.get(`http://localhost:3001/review`)
      .then(response => {
        setReviews(response.data);
        // Extract unique movie IDs from reviews
        const movieIds = [...new Set(response.data.map(review => review.movie_id))];
        // Fetch movie details for each ID
        return Promise.all(movieIds.map(id => axios.get(`http://localhost:3001/movies/${id}`)));
      })
      .then(responses => {
        // Combine movie details into an object keyed by movie ID
        const movieDetails = {};
        responses.forEach(response => {
          movieDetails[response.data.id] = response.data;
        });
        setMovies(movieDetails);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
      
  }, []);

  return (
    <div className="browse-reviews">
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
  <div key={review.review_id} className="review-item">
    {movies[review.movie_id] && (
  <div className="movie-poster-container" onClick={() => navigateToMovie(review.movie_id)}>
    <img src={`https://image.tmdb.org/t/p/w300${movies[review.movie_id].poster_path}`} 
         alt={movies[review.movie_id].title} />
  </div>
)}
    <h3>Review by: {review.username}</h3>
    <p>Rating: {review.rating}</p>
    <p>{review.review_text}</p>
    <p>Date: {new Date(review.review_date).toLocaleDateString()} {new Date(review.review_date).toLocaleTimeString()}</p>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default BrowseReviews;

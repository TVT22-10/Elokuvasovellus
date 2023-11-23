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
        console.error('Error fetching reviews:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="browse-reviews">
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.review_id} className="review-item">
              <h3>{review.username}</h3>
              <p>Movie ID: {review.movie_id}</p>
              <p>Rating: {review.rating}</p>
              <p>Review Text: {review.review_text}</p>
              <p>Review Date: {new Date(review.review_date).toLocaleDateString()}{' '}
                {new Date(review.review_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseReviews;

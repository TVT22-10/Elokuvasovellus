import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './browse_reviews.css';

function BrowseReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/review');
        const reviewsData = response.data;

        // Fetch movie images for each review
        const reviewsWithImages = await Promise.all(
          reviewsData.map(async (review) => {
            const movieImageUrl = await getMovieImageUrl(review.movie_id);
            return { ...review, movieImageUrl };
          })
        );

        setReviews(reviewsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getMovieImageUrl = async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:3001/movies/${movieId}/image`);
      return response.data.imageUrl;
    } catch (error) {
      console.error(`Error fetching image for movie ${movieId}:`, error);
      return ''; // Return an empty string or a default image URL
    }
  };

  return (
    <div className="browse-reviews">
      <h1>Browse Reviews</h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.review_id} className="review-item">
              <h3>{review.username}</h3>
              {review.movieImageUrl && (
                <img
                  src={review.movieImageUrl}
                  alt={`Movie ${review.movie_id} Image`}
                  className="movie-image"
                />
              )}
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

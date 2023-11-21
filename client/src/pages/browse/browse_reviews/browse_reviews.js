// browse_reviews.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './browse_reviews.css';

function BrowseReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reviews when the component mounts
    axios.get(`http://localhost:3001/review`)
      .then(response => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="browse-reviews">
      <h1>Browse Reviews</h1>
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

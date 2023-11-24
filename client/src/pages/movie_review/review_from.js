import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './review_form.css';
import { AuthContext } from '../../components/Contexts';

function ReviewForm({ movieId }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleStarClick = (index) => {
    // If the last star is clicked, set rating to 10; otherwise, use the index
    setRating(index === 9 ? 10 : index + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/review', {
        username: username,
        movieId,
        rating,
        reviewText,
      });

      console.log('Review added successfully:', response.data);
      // Optionally, you can refresh the reviews after submitting a new one
      // Implement a function to fetch reviews and update the state in MovieReviews component
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div className="review-form">
      <h2>ADD YOUR REVIEW</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <div className="star-rating">
            {[...Array(10)].map((_, index) => (
              <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index)}
              className={index < rating ? 'filled' : ''}
            >
              <FaStar className="star-icon" />
            </button>
            ))}
          </div>
        </label>
        <label>
          Review:
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;

// Import necessary dependencies
import React, { useState, useContext } from 'react';
import axios from 'axios';
import './review_form.css'; // Import the new CSS file
import { AuthContext } from '../../components/Contexts'; // Adjust the path based on your project structure

function ReviewForm({ movieId }) {
  // Access isLoggedIn from AuthContext
  const { userData } = useContext(AuthContext); // Add this line

  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/review', {
        username: userData.value.private, // Assuming the username is stored in userData.private
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
      <h2>Add Your Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
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

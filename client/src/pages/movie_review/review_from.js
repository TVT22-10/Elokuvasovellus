import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './review_form.css';
import { AuthContext } from '../../components/Contexts';

function ReviewForm({ movieId }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;
  const [rating, setRating] = useState(0);
  const [initialRating, setInitialRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedStar, setSelectedStar] = useState(-1);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleStarClick = (index) => {
    setRating(index === 9 ? 10 : index + 1);
    setSelectedStar(index);
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

      // Reset text field and show "Review submitted" message
      setReviewText('');
      setReviewSubmitted(true);

      // Reset the selected star buttons to their initial state
      setRating(initialRating);
      setSelectedStar(initialRating - 1);

      // Optionally, you can refresh the reviews after submitting a new one
      // Implement a function to fetch reviews and update the state in MovieReviews component
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  // Update initialRating when rating changes
  useEffect(() => {
    setInitialRating(rating);
  }, [rating]);

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
                className={index <= selectedStar ? 'filled' : ''}
              >
                <FaStar className="star-icon" />
              </button>
            ))}
          </div>
        </label>
        <label>
          Review:
          <textarea
            className='review-textfield'
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Add your review text here"
          />
        </label>
        <div className='review-form-button-and-message'>
          <button type="submit" className="submit-button">Submit Review</button>
          {reviewSubmitted && <p className="review-submitted-message">Review submitted</p>}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;

// The review_form.js is C:\Web-ohjelmoinnin sovellusprojekti\Elokuvasovellus\client\src\pages\movie_review\review_from.js
// make the import properly
import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import axios from 'axios';
import './movie_review.css'; // Import the new CSS file
import ReviewForm from './review_from';
import { AuthContext } from '../../components/Contexts'; // Adjust the path based on your project structure

function MovieReviews({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Access isLoggedIn from AuthContext
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Fetch reviews for the specific movie
    axios.get(`http://localhost:3001/review/${movieId}`)
      .then(response => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      });
  }, [movieId]);

  return (
    <div className="review-section">
      <h2 className="review-heading">REVIEWS</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.review_id} className="review-item">
                <h3>{review.username}</h3>
                <p>Rating: {review.rating}</p>
                <p>{review.review_text}</p>
                <p>Review Date: {new Date(review.review_date).toLocaleDateString()}{' '}
                {new Date(review.review_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              </div>
            ))
          ) : (
            <p>No reviews for this movie yet.</p>
          )}
        </div>
      )}

      {/* Display review form if user is logged in */}
      {isLoggedIn && <ReviewForm movieId={movieId} />}
    </div>
  );
}

export default MovieReviews;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './movie_review.css';
import ReviewForm from './review_from';
import StarRating from './StarRating'; // Import the new StarRating component
import { AuthContext } from '../../components/Contexts';
import { useNavigate } from 'react-router-dom';


function MovieReviews({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3); // Number of reviews initially visible
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();


  const navigateToPublicProfile = (username) => {
    navigate(`/public_profile/${username}`);
  };

  useEffect(() => {
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

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3);
  };

  return (
    <div className="movie-review-section">
      <h2 className="movie-review-heading">REVIEWS</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="movie-reviews-list">
          {reviews.length > 0 ? (
            reviews.slice(0, visibleReviews).map(review => (
              <div key={review.review_id} className="movie-review-item">
                <div className="review-profile-image">
                <div className='review-username clickable' onClick={() => navigateToPublicProfile(review.username)}>
                      <img src={`http://localhost:3001/avatars/${review.avatar}`} alt="User Avatar" className="avatar" />
                      <h3>{review.username}</h3>
                    </div>
                </div>
                <p>Posted on: {new Date(review.review_date).toLocaleDateString()}</p>
                <div className="rating-container">
                  <StarRating rating={review.rating} />
                </div>
                <p>{review.review_text}</p>
              </div>
            ))
          ) : (
            <p>No reviews for this movie yet.</p>
          )}
        </div>
      )}

      {reviews.length > visibleReviews && (
        <button className="load-more-button" onClick={loadMoreReviews}>
          Load more reviews
        </button>
      )}

      {isLoggedIn && <ReviewForm movieId={movieId} />}
    </div>
  );
}

export default MovieReviews;

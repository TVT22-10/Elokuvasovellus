import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './browse_reviews.css';
import { useNavigate } from 'react-router-dom';
import { userData } from '../../../components/Signals';
import StarRating from '../../movie_review/StarRating'; // Import the new StarRating component

function BrowseReviews() {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayedReviews, setDisplayedReviews] = useState(6);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [sortingOrder, setSortingOrder] = useState('newest'); // Default sorting order
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState('');
  const [username, setUsername] = useState('');

  const navigateToPublicProfile = (username) => {
    navigate(`/public_profile/${username}`);
  };


  useEffect(() => {
    if (userData.value) {
      if (userData.value.username && username !== userData.value.username) {
        setUsername(userData.value.username);
        setLoggedIn(true);
      }
      
      if (userData.value && userData.value.avatar) {
        setUserAvatar(`http://localhost:3001/avatars/${userData.value.avatar}`);
      } else {
        setUserAvatar('http://localhost:3001/avatars/avatar1.png');
      }
    }
  }, [userData.value, username]);

  const navigateToMovie = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handleLoadMore = () => {
    setDisplayedReviews(displayedReviews + 6);
  };

  const toggleReadMore = (reviewId) => {
    setExpandedReviews((prevExpanded) =>
      prevExpanded.includes(reviewId)
        ? prevExpanded.filter((id) => id !== reviewId)
        : [...prevExpanded, reviewId]
    );
  };

  const handleSortingChange = (event) => {
    setSortingOrder(event.target.value);
    // Fetch reviews based on the selected sorting order
    fetchReviews();
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/review?sort=${sortingOrder}`);
      const reviewsData = response.data;

      // Extract unique movie IDs from reviews
      const movieIds = [...new Set(reviewsData.map((review) => review.movie_id))];

      // Fetch movie details for each ID
      const movieResponses = await Promise.all(movieIds.map((id) => axios.get(`http://localhost:3001/movies/${id}`)));

      // Combine movie details into an object keyed by movie ID
      const movieDetails = {};
      movieResponses.forEach((movieResponse) => {
        movieDetails[movieResponse.data.id] = movieResponse.data;
      });

      setMovies(movieDetails);
      setReviews(reviewsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch reviews when the component mounts or when sortingOrder changes
    fetchReviews();
  }, [sortingOrder]);

  return (
    <div className="browse-reviews">
      <div className="sorting-dropdown">
        <label className='sortingorder-dropdown' htmlFor="sortingOrder">Sort by: </label>
        <select id="sortingOrder" value={sortingOrder} onChange={handleSortingChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="best">Best Review</option>
          <option value="worst">Worst Review</option>
        </select>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.slice(0, displayedReviews).map((review) => (
            <div key={review.review_id} className="review-item">
              <div className="jeps-review-content">
              <div className='review-userdata-container' onClick={() => navigateToPublicProfile(review.username)}>
                  <div className="review-profile-image">
                    <div className='review-username'>
                      {/* Make the image and username clickable */}
                      <img src={`http://localhost:3001/avatars/${review.avatar}`} alt="User Avatar" className="avatar clickable" />
                      <h3 className="clickable">{review.username}</h3>
                    </div>
                  </div>
                </div>
                <div className='browse-review-content'>
                  <p>Posted on: {new Date(review.review_date).toLocaleDateString()}</p>
                  <StarRating rating={review.rating} />
                  <p>
                    {expandedReviews.includes(review.review_id)
                      ? review.review_text
                      : `${review.review_text.slice(0, 70)}`}
                  </p>
                  {review.review_text.length > 70 && (
                    <div className='read-more-container'>
                      <button className='read-more' onClick={() => toggleReadMore(review.review_id)}>
                        {expandedReviews.includes(review.review_id) ? 'Read Less' : 'Read More'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {movies[review.movie_id] && (
                <div className="movie-poster-container" onClick={() => navigateToMovie(review.movie_id)}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movies[review.movie_id].poster_path}`}
                    alt={movies[review.movie_id].title}
                    className="browse-movie-poster"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {displayedReviews < reviews.length && (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}

export default BrowseReviews;

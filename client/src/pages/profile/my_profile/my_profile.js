import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './my_profile.css';
import { jwtToken, userData } from '../../../components/Signals';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../../movie_review/StarRating';

function Profile() {
  const [activeTab, setActiveTab] = useState('favourites');
  const [username, setUsername] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userAvatar, setUserAvatar] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [showFullReview, setShowFullReview] = useState(false);
  const navigate = useNavigate();

  const generateShareableLink = () => {
    const currentLink = `${window.location.origin}/profile?tab=${activeTab}`;

    navigator.clipboard
      .writeText(currentLink)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Unable to copy link: ', error);
      });
  };

  useEffect(() => {
    if (userData.value) {
      if (userData.value.username && username !== userData.value.username) {
        setUsername(userData.value.username);
        setLoggedIn(true);
      }
      if (userData.value.creation_time && creationDate !== formatCreationDate(userData.value.creation_time)) {
        const formattedCreationDate = formatCreationDate(userData.value.creation_time);
        setCreationDate(formattedCreationDate);
      }
      if (userData.value && userData.value.avatar) {
        setUserAvatar(`http://localhost:3001/avatars/${userData.value.avatar}`);
      } else {
        setUserAvatar('http://localhost:3001/avatars/avatar1.png');
      }
    }
  }, [userData.value, username, creationDate]);

  useEffect(() => {
    if (jwtToken.value && username) {
      axios
        .get(`http://localhost:3001/favorites/${username}`, { headers: { Authorization: `Bearer ${jwtToken.value}` } })
        .then((resp) => {
          setFavorites(resp.data);
        })
        .catch((error) => {
          console.error('Error fetching favorites:', error);
        });
    }
  }, [username, jwtToken.value]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/review/user/${username}`);
        const userReviewsData = response.data;

        const movieIds = [...new Set(userReviewsData.map((review) => review.movie_id))];

        const movieResponses = await Promise.all(movieIds.map((id) => axios.get(`http://localhost:3001/movies/${id}`)));

        const movieDetails = {};
        movieResponses.forEach((movieResponse) => {
          movieDetails[movieResponse.data.id] = movieResponse.data;
        });

        setMovies(movieDetails);
        setUserReviews(userReviewsData);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    if (activeTab === 'reviews' && loggedIn) {
      fetchUserReviews();
    }
  }, [activeTab, loggedIn, username]);

  const calculateRating = (rating) => {
    const circumference = 2 * Math.PI * 20;
    return (rating / 10) * circumference;
  };

  const navigateToMovie = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const formatCreationDate = (timestamp) => {
    if (!timestamp) {
      return 'No creation time';
    }

    let date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Invalid Format';
    }

    return date.toLocaleDateString();
  };

  const toggleShowFullReview = () => {
    setShowFullReview(!showFullReview);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-image">
            <img src={userAvatar} alt="User Avatar" className="avatar" />
          </div>
          <div className="profile">
            <div className="username">
              <h2>{username}</h2>
              <p>Account Created On: {creationDate}</p>
            </div>
            <div className="bio-buttons">
              <div className="share-button">
                <button id="edit" onClick={generateShareableLink}>
                  Share the view
                </button>
              </div>
              <div className="edit-button">
                <Link to="/edit_profile">
                  <button id="edit">Profile Settings</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-buttons">
          <p
            className={`view-change ${activeTab === 'favourites' ? 'active-link' : ''}`}
            onClick={() => setActiveTab('favourites')}
          >
            Favourites
          </p>
          <p
            className={`view-change ${activeTab === 'reviews' ? 'active-link' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </p>
          <p
            className={`view-change ${activeTab === 'posts' ? 'active-link' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </p>
        </div>
        <div className="profile-content">
          <div className={`content ${activeTab !== 'favourites' && 'hidden'}`} id="favourites">
            <div className="favorites-container">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="favorites-movie-card"
                  onClick={() => navigateToMovie(movie.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="favorites-movie-poster"
                  />
                  <div className="favorites-movie-info">
                    <div className="movie-rating-circle">
                      <svg width="40" height="40" viewBox="0 0 44 44">
                        <circle className="rating-circle-bg" cx="22" cy="22" r="20" />
                        <circle
                          className="rating-circle"
                          cx="22"
                          cy="22"
                          r="20"
                          strokeDasharray={`${calculateRating(movie.vote_average)} 999`}
                        />
                        <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="rating-text">
                          {movie.vote_average.toFixed(1)}
                        </text>
                      </svg>
                    </div>
                    <p className="favorites-movie-release-date">Released: {movie.release_date}</p>
                    <h3 className="favorites-movie-title">{movie.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`content ${activeTab !== 'reviews' && 'hidden'}`} id="reviews">
            {userReviews.length > 0 ? (
              <div className="rowed-reviews-container">
                {userReviews.map((review) => (
                  <div key={review.review_id} className="review-container">
                    <div className="review-content-left">
              <div classname='review-userdata-container'>
              <div className="review-profile-image">
              <div className='review-username'><img src={userAvatar} alt="User Avatar" className="avatar" /><h3>{username}</h3></div>
              </div>
              </div>
                      <div className="review-content">
                        <div className='profile-review-date'><p>Posted on: {new Date(review.review_date).toLocaleDateString()}</p></div>
                        <StarRating rating={review.rating} />
                        <div className='profile-review-text'>
                          {showFullReview ? (
                            <p>{review.review_text}</p>
                          ) : (
                            <p>
                              {review.review_text.length > 70
                                ? `${review.review_text.substring(0, 70)}...`
                                : review.review_text}
                              {review.review_text.length > 70 && (
                                <div className='read-more-container'><button className='read-more' onClick={toggleShowFullReview}>
                                  {showFullReview ? 'Read Less' : 'Read More'}
                                </button></div>
                              )}
                            </p>
                          )}
                        </div>
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
            ) : (
              <p>No reviews for this user yet.</p>
            )}
          </div>
          <div className={`content ${activeTab !== 'posts' && 'hidden'}`} id="posts">
            <p>Tähän tulis sitten käyttäjän postaukset</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './my_profile.css';
import { jwtToken, userData } from '../../../components/Signals';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [activeTab, setActiveTab] = useState('favourites');
  const [username, setUsername] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState('');

  const generateShareableLink = () => {
    const currentLink = `${window.location.origin}/profile?tab=${activeTab}`;
    navigator.clipboard.writeText(currentLink)
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
      axios.get(`http://localhost:3001/favorites/${username}`, { headers: { Authorization: `Bearer ${jwtToken.value}` }})
        .then(resp => {
          setFavorites(resp.data);
        })
        .catch(error => {
          console.error('Error fetching favorites:', error);
        });
    }
  }, [username, jwtToken.value]);

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
                <button id="edit" onClick={generateShareableLink}>Share the view</button>
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
          <p className={`view-change ${activeTab === 'favourites' ? 'active-link' : ''}`} onClick={() => setActiveTab('favourites')}>Favourites</p>
          <p className={`view-change ${activeTab === 'reviews' ? 'active-link' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</p>
          <p className={`view-change ${activeTab === 'posts' ? 'active-link' : ''}`} onClick={() => setActiveTab('posts')}>Posts</p>
        </div>
        <div className="profile-content">
          <div className={`content ${activeTab !== 'favourites' && 'hidden'}`} id="favourites">
            <div className="favorites-container">
              {favorites.map(movie => (
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
                        <circle
                          className="rating-circle-bg"
                          cx="22" cy="22" r="20"
                        />
                        <circle
                          className="rating-circle"
                          cx="22" cy="22" r="20"
                          strokeDasharray={`${calculateRating(movie.vote_average)} 999`}
                        />
                        <text
                          x="50%"
                          y="50%"
                          dy=".3em"
                          textAnchor="middle"
                          className="rating-text"
                        >
                          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
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
            <p>Tähän tulis sitten käyttäjän arvostelut</p>
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

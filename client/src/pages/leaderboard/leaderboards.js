import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './leaderboards.css';


function LeaderboardsPage() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [favoritesLeaderboardData, setFavoritesLeaderboardData] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:3001/review/top-reviewers') // Replace with your actual API endpoint
            .then(response => {
                setLeaderboardData(response.data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/favorites/top-favorites') // Adjust the endpoint as needed
            .then(response => {
                setFavoritesLeaderboardData(response.data);
            })
            .catch(error => {
                console.error('Error fetching favorites leaderboard data:', error);
            });
    }, []);
    

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <div className="grid-container">
                {/* Reviews Leaderboard Box */}
                <div className="leaderboard-box">
                    <h2>Reviews</h2>
                    {leaderboardData.length > 0 ? (
                        <ul className="leaderboard-list">
                            {leaderboardData.map((user, index) => (
                                <li key={index} className={`leaderboard-item ${index === 0 ? 'top-user' : ''}`}>
                                    <img src={`http://localhost:3001/avatars/${user.avatar}`} alt={`${user.username}'s avatar`} className="user-avatar" />
                                    <p className="username">{user.username}</p>
                                    <p className="review-count">{user.review_count}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading leaderboard...</p>
                    )}
                </div>

                {/* Favorites Leaderboard Box */}
                <div className="leaderboard-box">
                    <h2>Favorites</h2>
                    {favoritesLeaderboardData.length > 0 ? (
                        <ul className="leaderboard-list">
                            {favoritesLeaderboardData.map((user, index) => (
                                <li key={index} className={`leaderboard-item ${index === 0 ? 'top-user' : ''}`}>
                                    {/* Assuming similar structure for user data in favorites */}
                                    <img src={`http://localhost:3001/avatars/${user.avatar}`} alt={`${user.username}'s avatar`} className="user-avatar" />
                                    <p className="username">{user.username}</p>
                                    <p className="review-count">{user.favorite_count}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading favorites leaderboard...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LeaderboardsPage;


  
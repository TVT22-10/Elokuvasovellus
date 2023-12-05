import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './leaderboards.css';
import { useNavigate } from 'react-router-dom';




function LeaderboardsPage() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [favoritesLeaderboardData, setFavoritesLeaderboardData] = useState([]);
    const [oldestMembers, setOldestMembers] = useState([]);
    const [newestMembers, setNewestMembers] = useState([]);
    const navigate = useNavigate();


    const navigateToPublicProfile = (username) => {
        navigate(`/public_profile/${username}`);
    };

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

    useEffect(() => {
        // Fetch oldest members
        axios.get('http://localhost:3001/user/oldest-members')
            .then(response => {
                setOldestMembers(response.data);

            })
            .catch(error => {
                console.error('Error fetching oldest members:', error);
            });

        // Fetch newest members
        axios.get('http://localhost:3001/user/newest-members')
            .then(response => {
                setNewestMembers(response.data);
            })
            .catch(error => {
                console.error('Error fetching newest members:', error);
            });
    }, []);

    function convertToDays(creationTime) {
        const creationDate = new Date(creationTime);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - creationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    }



    return (
        <div className="leaderboard-container">
            <h1>Statistics</h1>
            <div className="grid-container">
                {/* Reviews Leaderboard Box */}
                <div className="leaderboard-box">
                    <h2>Reviews</h2>
                    {leaderboardData.length > 0 ? (
                        <ul className="leaderboard-list">
                            {leaderboardData.map((user, index) => (
                                <li key={index} className={`leaderboard-item ${index === 0 ? 'top-user' : ''}`}>
                                    <img
                                        src={`http://localhost:3001/avatars/${user.avatar}`}
                                        alt={`${user.username}'s avatar`}
                                        className="user-avatar clickable"
                                        onClick={() => navigateToPublicProfile(user.username)}
                                    />
                                    <p className="username clickable" onClick={() => navigateToPublicProfile(user.username)}>
                                        {user.username}
                                    </p>
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
                                    <img
                                        src={`http://localhost:3001/avatars/${user.avatar}`}
                                        alt={`${user.username}'s avatar`}
                                        className="user-avatar clickable"
                                        onClick={() => navigateToPublicProfile(user.username)}
                                    />
                                    <p className="username clickable" onClick={() => navigateToPublicProfile(user.username)}>
                                        {user.username}
                                    </p>
                                    <p className="review-count">{user.favorite_count}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading favorites leaderboard...</p>
                    )}
                </div>
                {/* Oldest Members Leaderboard Box */}
                <div className="leaderboard-box">
                    <h2>Oldest Members</h2>
                    {oldestMembers.length > 0 ? (
                        <ul className="leaderboard-list">
                            {oldestMembers.map((member, index) => (

                                <li key={index} className={`leaderboard-item ${index === 0 ? 'top-user' : ''}`}>
                                    <img
                                        src={`http://localhost:3001/avatars/${member.avatar}`}
                                        alt={`${member.username}'s avatar`}
                                        className="user-avatar clickable"
                                        onClick={() => navigateToPublicProfile(member.username)}
                                    />
                                    <p className="username clickable" onClick={() => navigateToPublicProfile(member.username)}>
                                        {member.username}
                                    </p>
                                    <p className="days-count">{convertToDays(member.creation_time)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading oldest members...</p>
                    )}
                </div>

                {/* Newest Members Leaderboard Box */}
                <div className="leaderboard-box">
                    <h2>Newest Members</h2>
                    {newestMembers.length > 0 ? (
                        <ul className="leaderboard-list">
                            {newestMembers.map((member, index) => (
                                <li key={index} className={`leaderboard-item ${index === 0 ? 'top-user' : ''}`}>
                                <img 
                                  src={`http://localhost:3001/avatars/${member.avatar}`} 
                                  alt={`${member.username}'s avatar`} 
                                  className="user-avatar clickable" 
                                  onClick={() => navigateToPublicProfile(member.username)}
                                />
                                <p className="username clickable" onClick={() => navigateToPublicProfile(member.username)}>
                                  {member.username}
                                </p>
                                    <p className="days-count">{convertToDays(member.creation_time)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading newest members...</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default LeaderboardsPage;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActorDetails.css';

function ActorDetail() {
    const { actorId } = useParams();
    const navigate = useNavigate();

    // State for actor details
    const [actorDetails, setActorDetails] = useState({});

    // State for currently displayed filmography based on active tab
    const [filmography, setFilmography] = useState([]);

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('movies');

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        // Function to fetch actor details
        const fetchActorData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/actors/${actorId}`, { signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch actor details. Status: ${response.status}`);
                }
                const details = await response.json();
                setActorDetails(details);
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error('Error fetching actor details:', error);
                }
            }
        };



        // Function to fetch filmography data
        const fetchFilmography = async (endpoint) => {
            try {
                const response = await fetch(`http://localhost:3001/actors/${actorId}/${endpoint}`, { signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error(`Error fetching ${endpoint}:`, error);
                }
                return [];
            }
        };

        // Function to update filmography based on the active tab
        const updateFilmography = async () => {
            let response = await fetchFilmography(activeTab === 'movies' ? 'movies' : 'series');

            let data;
            if (activeTab === 'movies') {
                // Handle movie data
                if (!Array.isArray(response)) {
                    console.error('Expected an array for movies, but received:', response);
                    setFilmography([]);
                    return;
                }
                data = response; // Movie data is directly the array
            } else {
                // Handle series data
                if (!response || !Array.isArray(response.cast)) {
                    console.error('Invalid response structure for series:', response);
                    setFilmography([]);
                    return;
                }
                data = response.cast; // Use the 'cast' array for series
            }

            // Group by id
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { ...item, credit_ids: [item.credit_id], episode_counts: [item.episode_count] };
                } else {
                    acc[item.id].credit_ids.push(item.credit_id);
                    acc[item.id].episode_counts.push(item.episode_count);
                }
                return acc;
            }, {});

            const uniqueData = Object.values(groupedData);

            setFilmography(uniqueData);
        };





        fetchActorData();
        updateFilmography();

        return () => {
            abortController.abort(); // Cancel the fetch request when the component unmounts or dependencies change
        };
    }, [actorId, activeTab]);





    const navigateToMovieOrSeries = (item) => {
        const path = activeTab === 'movies' ? 'movies' : 'series';
        navigate(`/${path}/${item.id}`);
    };

    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20;
        return (rating / 10) * circumference;
    };

    return (
        <div className="relative-container">
            <div className="gradient-overlay"></div>
            <div className="actor-details-container">
                <img
                    src={`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`}
                    alt={actorDetails.name}
                    className="actor-profile-image"
                />
                <div className="actor-detail-content">
                    <h1 className="detail-title">{actorDetails.name}</h1>
                    <div className="actor-info-container">
                        {/* Actor Facts */}
                        {actorDetails.birthday && <span className="actor-facts">Born: {actorDetails.birthday}</span>}
                        {actorDetails.place_of_birth && <span className="actor-facts">Birthplace: {actorDetails.place_of_birth}</span>}
                        {/* Add more actor facts as needed */}
                    </div>
                    <p>{actorDetails.biography}</p>
                    {/* Add other details like filmography */}
                </div>
            </div>

            {/* Filmography Section */}
            <div className="actor-filmography">
                <div className="filmography-tabs">
                    <button
                        className={`filmography-tab ${activeTab === 'movies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('movies')}
                    >
                        Movies
                    </button>
                    <button
                        className={`filmography-tab ${activeTab === 'series' ? 'active' : ''}`}
                        onClick={() => setActiveTab('series')}
                    >
                        Series
                    </button>
                </div>
                <div className="filmography-heading-container">
                    <h2 className="filmography-heading">
                        {activeTab === 'movies' ? 'Movie' : 'Series'} Filmography
                    </h2>
                </div>
                <div className="search-results-container">
                    {filmography.map((item, index) => (
                        <div
                            key={`${item.id}-${item.credit_id}`} // Unique key using id and credit_id
                            className="movie"
                            onClick={() => navigateToMovieOrSeries(item)}
                        >
                            <div className="movie-poster-wrapper">
                                <img
                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'path_to_placeholder_image'}
                                    alt={activeTab === 'movies' ? item.title : item.name}
                                    className="movie-poster"
                                />

                                <div className="movie-info">
                                    <div className="movie-rating-circle">
                                        <svg width="40" height="40" viewBox="0 0 44 44">
                                            <circle
                                                className="rating-circle-bg"
                                                cx="22" cy="22" r="20"
                                            />
                                            <circle
                                                className="rating-circle"
                                                cx="22" cy="22" r="20"
                                                strokeDasharray={`${calculateRating(item.vote_average)} 999`}
                                            />
                                            <text
                                                x="50%"
                                                y="50%"
                                                dy=".3em" /* Adjust this value as needed */
                                                textAnchor="middle"
                                                className="rating-text"
                                            >
                                                {item.vote_average.toFixed(1)}
                                            </text>

                                        </svg>
                                    </div>
                                    <h3 className="movie-title">{activeTab === 'movies' ? item.title : item.name}</h3>
                                    <p className="movie-release-date">Released: {activeTab === 'movies' ? item.release_date : item.first_air_date}</p>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ActorDetail;

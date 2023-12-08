import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActorDetails.css';

function ActorDetail() {
    const { actorId } = useParams();
    const [actorDetails, setActorDetails] = useState({});
    const [filmography, setFilmography] = useState([]); // Added state for filmography
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActorData = async () => {
            try {
                const detailsResponse = await fetch(`http://localhost:3001/actors/${actorId}`);
                const detailsData = await detailsResponse.json();

                const filmographyResponse = await fetch(`http://localhost:3001/actors/${actorId}/movies`);
                const filmographyData = await filmographyResponse.json();

                setActorDetails(detailsData);
                setFilmography(filmographyData); // Now we can update filmography state
            } catch (error) {
                console.error('Error fetching actor details or filmography:', error);
            }
        };

        fetchActorData();
    }, [actorId]);

    const navigateToMovie = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
        return (rating / 10) * circumference; // Convert to length of the circle's stroke
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
                <div className="filmography-heading-container">
                    <h2 className="filmography-heading">Filmography</h2>
                </div>
                <div className="movie-container">
                    {filmography.map(movie => (
                        <div key={movie.id} className="movie" onClick={() => navigateToMovie(movie.id)}>
                            <div className="movie-poster-wrapper">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
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
                                                strokeDasharray={`${calculateRating(movie.vote_average)} 999`}
                                            />
                                            <text
                                                x="50%"
                                                y="50%"
                                                dy=".3em" /* Adjust this value as needed */
                                                textAnchor="middle"
                                                className="rating-text"
                                            >
                                                {movie.vote_average.toFixed(1)}
                                            </text>

                                        </svg>
                                    </div>
                                    <h3 className="movie-title">{movie.title}</h3>
                                    <p className="movie-release-date">Released: {movie.release_date}</p>
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

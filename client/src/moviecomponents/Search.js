import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import './Search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1); // State for tracking the current page
    const navigate = useNavigate(); // Initialize useNavigate

    const performSearch = useCallback(async (pageNum) => {
        try {
            const response = await fetch(`http://localhost:3001/search?query=${query}&page=${pageNum}`);
            const data = await response.json();
            if (pageNum === 1) {
                setResults(data.results); // Set new results if it's the first page
            } else {
                setResults(prevResults => [...prevResults, ...data.results]); // Append new results for other pages
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, [query]); // Add dependencies here


    useEffect(() => {
        // Debounce the search operation
        const delayDebounce = setTimeout(() => {
            if (query) {
                setPage(1); // Reset to page 1 whenever the query changes
                performSearch(1); // Fetch the first page of results
            } else {
                setResults([]); // Clear results if query is empty
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [query, performSearch]); // Include performSearch in the dependency array



    const navigateToMovie = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
        return (rating / 10) * circumference; // Convert to length of the circle's stroke
    };

    const loadMoreResults = async () => {
        const nextPage = page + 1;
        await performSearch(nextPage);
        setPage(nextPage); // Update the page state after fetching new results
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a movie..."
                className="search-input"
            />


            <div className="search-results-container">
                {results.map((movie, index) => (
                    <div
                        key={`${movie.id}-${index}`} // Combine ID with index
                        className="search-movie-card"
                        onClick={() => navigateToMovie(movie.id)}
                    >
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="search-movie-poster"
                            />
                        )}
                        <div className="search-movie-info">
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
                            <p className="search-movie-release-date">Released: {movie.release_date}</p>
                            <h3 className="search-movie-title">{movie.title}</h3>
                        </div>

                    </div>
                ))}

            </div>
            {/* Conditionally render Load More button */}
            {results.length > 0 && (
                <div className="load-more-container">
                    <button onClick={loadMoreResults} className="load-more-button">LOAD MORE</button>
                </div>
            )}
        </div>
    );
}

export default Search;

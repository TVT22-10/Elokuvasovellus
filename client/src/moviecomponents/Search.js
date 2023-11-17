import React, { useState, useEffect } from 'react';
import './Search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Debounce the search operation
        const delayDebounce = setTimeout(() => {
            if (query) {
                performSearch();
            } else {
                setResults([]); // Clear results if query is empty
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const performSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3001/search?query=${query}`);
            const data = await response.json();
            console.log(data); // Log the response
            setResults(data.results);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
        return (rating / 10) * circumference; // Convert to length of the circle's stroke
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
    {results.map(movie => (
        <div key={movie.id} className="search-movie-card">
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="search-movie-poster"
            />
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


        </div>
    );
}

export default Search;

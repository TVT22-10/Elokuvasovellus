import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ... other imports

function generateYearOptions(startYear, endYear) {
    let years = [];
    for (let year = endYear; year >= startYear; year--) {
        years.push(year);
    }
    return years;
}

function BrowseMovies() {
    const [filters, setFilters] = useState({
        genre: '',
        startYear: '',
        endYear: '', // New state for the end year
        originalLanguage: '', // Renamed state for original language

        // ... other filters
    });
    const [sortOption, setSortOption] = useState(''); // State for sorting
    const [movies, setMovies] = useState([]); // State for movies
    const [totalPages, setTotalPages] = useState(0);

    const [page, setPage] = useState(1); // State for pagination
    const navigate = useNavigate();
    const years = generateYearOptions(1930, new Date().getFullYear());


    useEffect(() => {
        console.log("Fetching movies with filters:", filters);
        fetchMovies();
    }, [filters, sortOption, page]);


    const fetchMovies = async () => {
        try {
            const params = { ...filters, sort: sortOption, page };
            console.log("API Request Params:", params); // Check the parameters
            const url = new URL(`http://localhost:3001/discover-movies`);
            url.search = new URLSearchParams(params).toString();
            console.log("API Request URL:", url.toString()); // Check the URL

            const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0); // Update totalPages based on the API response
    } catch (error) {
        console.error('Error:', error);
    }
};

    const loadMoreResults = async () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            await fetchMovies(nextPage);
            setPage(nextPage);
        }
    };


    const navigateToMovie = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    // Function to handle changes in filter UI components
    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, [filterType]: value };
            console.log("Updated Filters:", updatedFilters);
            return updatedFilters;
        });
    };


    // Function to handle changes in sorting UI components
    const handleSortChange = (value) => {
        setSortOption(value);
    };

    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20; // Assuming the radius of the circle is 20
        return (rating / 10) * circumference; // Convert to length of the circle's stroke
    };



    return (
        <div>
            <div className="filters-container">
                {/* Genre Dropdown */}
                <select value={filters.genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
                    <option value="">Select Genre</option>
                    <option value="28">Action</option>
                    <option value="12">Adventure</option>
                    <option value="16">Animation</option>
                    <option value="35">Comedy</option>
                    <option value="80">Crime</option>
                    <option value="99">Documentary</option>
                    <option value="18">Drama</option>
                    <option value="10751">Family</option>
                    <option value="14">Fantasy</option>
                    <option value="36">History</option>
                    <option value="27">Horror</option>
                    <option value="10402">Music</option>
                    <option value="9648">Mystery</option>
                    <option value="10749">Romance</option>
                    <option value="878">Science Fiction</option>
                    <option value="10770">TV Movie</option>
                    <option value="53">Thriller</option>
                    <option value="10752">War</option>
                    <option value="37">Western</option>
                </select>

                {/* Start Year Dropdown */}
                <select value={filters.startYear} onChange={(e) => handleFilterChange('startYear', e.target.value)}>
                    <option value="">Select Start Year</option>
                    {years.map(year => (
                        <option key={`start-${year}`} value={year}>{year}</option>
                    ))}
                </select>

                {/* End Year Dropdown */}
                <select value={filters.endYear} onChange={(e) => handleFilterChange('endYear', e.target.value)}>
                    <option value="">Select End Year</option>
                    {years.map(year => (
                        <option key={`end-${year}`} value={year}>{year}</option>
                    ))}
                </select>
                {/* Language Dropdown */}
                <select value={filters.originalLanguage} onChange={(e) => handleFilterChange('originalLanguage', e.target.value)}>
                    <option value="">Select Original Language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Mandarin (Chinese)</option>
                    <option value="ru">Russian</option>
                    <option value="pt">Portuguese</option>
                    <option value="hi">Hindi</option>
                    <option value="fi">Finnish</option>
                    {/* Add more languages as needed */}
                </select>

                {/* Add more filter UI components here as needed */}
            </div>
            <div className="search-results-container">
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className="search-movie-card"
                        onClick={() => navigateToMovie(movie.id)}
                    >
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
                                        dy=".3em"
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
            {page < totalPages && (
                <div className="load-more-container">
                    <button onClick={loadMoreResults} className="load-more-button">LOAD MORE</button>
                </div>
        )}
        </div>
    );
}

export default BrowseMovies;

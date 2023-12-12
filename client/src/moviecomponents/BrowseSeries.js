import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function generateYearOptions(startYear, endYear) {
    let years = [];
    for (let year = endYear; year >= startYear; year--) {
        years.push(year);
    }
    return years;
}

function BrowseSeries() {
    // ... Similar state variables as in BrowseMovies
    const [filters, setFilters] = useState({
        genre: '',
        startYear: '',
        endYear: '',
        originalLanguage: '',
        minSeriesLength: '', // Added this state variable
        maxSeriesLength: '', // Added this state variable
        // ... other filters specific to series
    });

    const [series, setSeries] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const years = generateYearOptions(1930, new Date().getFullYear());
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [minVoteCount, setMinVoteCount] = useState(''); // Initialize with a suitable default value


    useEffect(() => {
        console.log("Fetching series with filters:", filters, "sort by:", sortBy,
            "minimum votes:", minVoteCount, "min length:", filters.minSeriesLength,
            "max length:", filters.maxSeriesLength);
        fetchSeries();
    }, [filters, sortBy, minVoteCount, page]); 

    const fetchSeries = async (newPage = page) => {
        try {
            // Construct query params based on filters
            const params = {
                ...filters,
                sort_by: sortBy,
                'vote_count.gte': minVoteCount,
                'first_air_date.gte': filters.startYear, // Updated to use filters.startYear
                'first_air_date.lte': filters.endYear, // Updated to use filters.endYear
                page: newPage
            };

            const response = await fetch(`http://localhost:3001/discover-tv?${new URLSearchParams(params)}`);
            const data = await response.json();

            if (newPage === 1) {
                setSeries(data.results || []); // Replace series for the first page
            } else {
                setSeries(prevSeries => {
                    const combinedSeries = [...prevSeries, ...(data.results || [])];
                    const uniqueSeries = combinedSeries.reduce((acc, current) => {
                        const x = acc.find(item => item.id === current.id);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    return uniqueSeries;
                });
            }
            setTotalPages(data.total_pages || 0);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadMoreResults = async () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            await fetchSeries(nextPage); // Pass the new page number to fetchSeries
            setPage(nextPage);
        }
    };

    const navigateToSeries = (seriesId) => {
        navigate(`/series/${seriesId}`);
    };

    // Function to handle changes in filter UI components
    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, [filterType]: value };
            console.log("Updated Filters:", updatedFilters);
            return updatedFilters;
        });
        setPage(1); // Reset page number to 1
    };

    // Function to handle changes in sorting UI components
    const handleSortChange = (value) => {
        setSortBy(value);
        setPage(1); // Reset page number to 1
    };

    // The calculateRating function remains unchanged
    const calculateRating = (rating) => {
        const circumference = 2 * Math.PI * 20;
        return (rating / 10) * circumference;
    };


    return (
        <div>
            <div className="filters-container">
                {/* Genre Dropdown */}
                <select className="select-dropdown" value={filters.genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
                    <option value="">Select Genre</option>
                    <option value="10759">Action & Adventure</option>
                    <option value="16">Animation</option>
                    <option value="35">Comedy</option>
                    <option value="80">Crime</option>
                    <option value="99">Documentary</option>
                    <option value="18">Drama</option>
                    <option value="10751">Family</option>
                    <option value="10762">Kids</option>
                    <option value="9648">Mystery</option>
                    <option value="10763">News</option>
                    <option value="10764">Reality</option>
                    <option value="10765">Sci-Fi & Fantasy</option>
                    <option value="10766">Soap</option>
                    <option value="10767">Talk</option>
                    <option value="10768">War & Politics</option>
                    <option value="37">Western</option>
                </select>
            
            {/* Start Year Dropdown */}
            <select className="select-dropdown" value={filters.startYear} onChange={(e) => handleFilterChange('startYear', e.target.value)}>
                <option value="">Select Start Year</option>
                {years.map(year => (
                    <option key={`start-${year}`} value={year}>{year}</option>
                ))}
            </select>

            {/* End Year Dropdown */}
            <select className="select-dropdown" value={filters.endYear} onChange={(e) => handleFilterChange('endYear', e.target.value)}>
                <option value="">Select End Year</option>
                {years.map(year => (
                    <option key={`end-${year}`} value={year}>{year}</option>
                ))}
            </select>

            {/* Language Dropdown */}
            <select className="select-dropdown" value={filters.originalLanguage} onChange={(e) => handleFilterChange('originalLanguage', e.target.value)}>
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

            {/* Sort By Dropdown */}
            <select className="select-dropdown" value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="popularity.desc">Popularity Descending</option>
                <option value="popularity.asc">Popularity Ascending</option>
                <option value="first_air_date.desc">First Air Date Descending</option>
                <option value="first_air_date.asc">First Air Date Ascending</option>
                <option value="vote_average.desc">Vote Average Descending</option>
                <option value="vote_average.asc">Vote Average Ascending</option>
                <option value="vote_count.desc">Vote Count Descending</option>
                <option value="vote_count.asc">Vote Count Ascending</option>
            </select>
            

            <input
                    type="number"
                    className="number-input"
                    value={minVoteCount}
                    onChange={(e) => setMinVoteCount(e.target.value)}
                    placeholder="Minimum Vote Count"
                />
</div>
            {/* Render TV series */}
            <div className="search-results-container">
                {series.map((serie, index) => (
                    <div
                        key={`${serie.id}-${index}`} // Modified key
                        className="search-movie-card"
                        onClick={() => navigateToSeries(serie.id)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                            alt={serie.name} // Series title might be under 'name'
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
                                        strokeDasharray={`${calculateRating(serie.vote_average)} 999`}
                                    />
                                    <text
                                        x="50%"
                                        y="50%"
                                        dy=".3em"
                                        textAnchor="middle"
                                        className="rating-text"
                                    >
                                        {serie.vote_average.toFixed(1)}
                                    </text>
                                </svg>
                            </div>
                            <p className="search-movie-release-date">First Air Date: {serie.first_air_date}</p>
                            <h3 className="search-movie-title">{serie.name}</h3>
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

export default BrowseSeries;

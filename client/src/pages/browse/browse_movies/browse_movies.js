import React from 'react';
import BrowseMovies from '../../../moviecomponents/BrowseMovies';

function BrowseMoviesPage() {
    return (
        <>
            <div className="heading-container">
                <h1 className="search-movie-heading">Browse</h1>
            </div>
            <div style={{ padding: '20px 80px 50px 80px' }}>
                <BrowseMovies />
            </div>
        </>
    );
}

export default BrowseMoviesPage;

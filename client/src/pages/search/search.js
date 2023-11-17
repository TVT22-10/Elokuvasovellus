import React from 'react';
import Search from '../../moviecomponents/Search';
import './search.css';

function SearchPage() {
    return (
        <>
            <div className="heading-container">
                <h1 className="search-movie-heading">Search movies</h1>
            </div>
            <div style={{ padding: '50px 80px 50px 80px' }}>
                <Search />
            </div>
        </>
    );
}

export default SearchPage;

import React from 'react';
import SearchTV from '../../moviecomponents/SearchTV';
import './search.css';

function SearchTVPage() {
    return (
        <>
            <div className="heading-container">
                <h1 className="search-movie-heading">Search series</h1>
            </div>
            <div style={{ padding: '50px 80px 50px 80px' }}>
                <SearchTV />
            </div>
        </>
    );
}

export default SearchTVPage;

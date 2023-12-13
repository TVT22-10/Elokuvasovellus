import React from 'react';
import BrowseSeries from '../../../moviecomponents/BrowseSeries';

function BrowseSeriesPage() {
    return (
        <>
            <div className="heading-container">
                <h1 className="search-movie-heading">Browse Series</h1>
            </div>
            <div style={{ padding: '20px 80px 50px 80px' }}>
                <BrowseSeries />
            </div>
        </>
    );
}

export default BrowseSeriesPage;

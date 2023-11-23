import React from 'react';
import PopularMovies from '../../moviecomponents/PopularMovies';
import TopRatedMovies from '../../moviecomponents/TopRatedMovies'; // Import the new component

function HomePage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h1>Popular Movies</h1>
      <PopularMovies />
      <h1>Top Rated Movies</h1> {/* New Section Title */}
      <TopRatedMovies /> {/* New Component for Top Rated Movies */}
    </div>
  );
}

export default HomePage;

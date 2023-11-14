import React from 'react';
import PopularMovies from '../../moviecomponents/PopularMovies';

function HomePage() {
  return (
    <div style={{ padding: '0 20px' }}> {/* Adds padding to left and right */}
      <h1>Popular movies</h1>
      <PopularMovies />
    </div>
  );
}

export default HomePage;

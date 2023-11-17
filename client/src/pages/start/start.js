import React from 'react';
import PopularMovies from '../../moviecomponents/PopularMovies';
import TopRatedMovies from '../../moviecomponents/TopRatedMovies'; // Import the new component
import './start.css';
function HomePage() {
  return (
    <div style={{ padding: '50px 80px 50px 80px' }}>
      <h1 className="movie-heading">Popular Movies</h1>
      <PopularMovies />
      <h1 className="movie-heading">Top Rated Movies</h1> {/* New Section Title */}
      <TopRatedMovies /> {/* New Component for Top Rated Movies */}
    </div>
  );
}

export default HomePage;

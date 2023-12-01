import React from 'react';
import PopularMovies from '../../moviecomponents/PopularMovies';
import TopRatedMovies from '../../moviecomponents/TopRatedMovies'; // Import the new component
import Upcoming from '../../moviecomponents/Upcoming'; // Import the new component

import './start.css';
function HomePage() {
  return (
    <div className='start-page'>
      <h1 className="movie-heading">Popular Movies</h1>
      <PopularMovies />
      <h1 className="movie-heading">Top Rated Movies</h1> {/* New Section Title */}
      <TopRatedMovies /> {/* New Component for Top Rated Movies */}
      <h1 className="movie-heading">Upcoming</h1> {/* New Section Title */}
      <Upcoming /> {/* New Component for Top Rated Movies */}
    </div>
  );
}

export default HomePage;

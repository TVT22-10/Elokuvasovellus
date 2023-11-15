import React from 'react';
import './browse_reviews.css'; // Make sure to adjust the path based on your project structure and file name

function BrowseReviews() {
  return (
    <div className="top-bar">
      <h1>Elokuvakerho</h1>
      <nav>
        <p>Etsi</p>
        <p>Selaa</p>
        <p>Ryhmät</p>
        <p>Profiili</p>
      </nav>
      <hr className="separator" />
      <div className="centered-text">
        <p className="upper-text">Kaikki arvostelut</p>
      </div>
    </div>
  );
}

export default BrowseReviews;

import React from 'react';
import './browse_all.css'; // Adjust the path to your stylesheet

function BrowseReviews() {
  return (
    <>
      <div className="top-bar">
        <h1>Elokuvakerho</h1>
        <nav>
          <p>Etsi</p>
          <p>Selaa</p>
          <p>Ryhmät</p>
          <p>Profiili</p>
        </nav>
      </div>
      <hr className="separator" />
      <div className="centered-text">
        <p className="upper-text">Elokuvat</p>
        <p className="lower-text">Viimeisimmät arvostelut</p>
      </div>
    </>
  );
}

export default BrowseReviews;

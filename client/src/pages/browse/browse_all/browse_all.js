import React from 'react';
import './browse_everything.css'; // Adjust the path to your stylesheet

const MyComponent = () => {
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
};

export default MyComponent;

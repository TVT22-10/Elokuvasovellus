import React from 'react';
import './edit_group.css'; // Import your stylesheet

function EditGroup() {
  return (
    <div>
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

      <div className="box-container">
        <div className="box">Muokkaa ryhmää</div>
        <div className="box">Tietoja</div>
        <div className="box">Jäsenet</div>
        <div className="box">Uutiset</div>
      </div>
      <div className="profile-container">
        <img src="path/to/Unknown_person.jpg" alt="Profile Picture" />
      </div>
      <p className="sample-text">Sample Text</p>
    </div>
  );
}

export default EditGroup;

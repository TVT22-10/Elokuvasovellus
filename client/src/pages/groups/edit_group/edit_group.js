import React from 'react';
import './edit_group.css';

function EditGroup() {
  return (
    <div className="edit-group">
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

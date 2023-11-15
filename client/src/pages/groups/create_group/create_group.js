import React from 'react';
import './create_group.css'; // Import your stylesheet if needed

class RegisterPage extends React.Component {
  render() {
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

        <div className="label-container">
          <h4>Hae ryhmiä</h4>
          <input type="text" id="username" name="username" />
        </div>
        <h2>Omat ryhmäni</h2>
        <h3>Luo uusi ryhmä +</h3>
      </div>
    );
  }
}

export default RegisterPage;

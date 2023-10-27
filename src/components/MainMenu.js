import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import AudioRecorder from '../VoiceRecognition/audiocapture.js';
import './MainMenu.css'
import { Link, useNavigate } from "react-router-dom";

function MainMenu() {
  const [apiData, setApiData] = useState(null);
  const navigate = useNavigate();
  const handleApiResponse = (data) => {
    setApiData(data);
    if (data.transcription && data.transcription.comando === "agregar") {
      navigate('/agregar');
    }
  };

  console.log(apiData)

  return (
    <div className="menu-container">
      <nav className="main-menu">
        <h1>Menu Principal</h1>
      </nav>
      <div className="icon-container">
        <Link to="/agregar">
          <FontAwesomeIcon className="icon" icon={faHome} />
        </Link>
        <FontAwesomeIcon className="icon" icon={faUser} />
        <FontAwesomeIcon className="icon" icon={faCog} />
      </div>
      <div>
        <AudioRecorder onApiResponse={handleApiResponse}/>
      </div>
      {/* Mostrar los datos cuando apiData no es null */}
      {apiData && apiData.transcription && (
  <div>
    <p>Cantidad: {apiData.transcription.cantidad}</p>
    <p>Comando: {apiData.transcription.comando}</p>
    <p>Nombre del producto: {apiData.transcription.nombre_producto}</p>
    <p>Precio: {apiData.transcription.precio}</p>
    <p>Texto: {apiData.transcription.texto}</p>
  </div>
)}
    </div>
  );
}

export default MainMenu;

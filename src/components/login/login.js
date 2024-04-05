import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./loginform";
import "./login.css";
import AudioRecorder from "../../VoiceRecognition/audiocapture.js";

function Login() {
  const [apiData, setApiData] = useState(null);

  const handleApiResponse = (data) => {
    const { transcription } = data;

    setApiData(data);
    if (transcription) {
      console.log(transcription);
    } else {
      console.log("ELIJA BODEGA");
    }
  };
  return (
    <div className="menu-container">
      <nav className="main-menu">
        <h1>Bienvenido a EasyInventory</h1>
      </nav>
      <div className="container">
        <h2>Inicio de sesión</h2>
        <LoginForm />
      </div>
      <div className="container">
        <p>No tiene cuenta, Registrese de inmediato </p>
        <Link to="/register">
          <button>Registro</button>
        </Link>
      </div>
      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default Login;

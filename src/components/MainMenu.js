import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../VoiceRecognition/audiocapture.js";
import "./MainMenu.css";
import { Link, useNavigate } from "react-router-dom";
import AddBodegaPage from "./Bodega/bodega.js";
import { useBodega } from "./context/BodegaContext.js";
import { useAuth } from "./context/AuthContext.js";

function MainMenu() {
  const [apiData, setApiData] = useState(null);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const { getBodegas, bodegas } = useBodega();

  useEffect(() => {
    getBodegas();
  }, []);

  const handleApiResponse = (data) => {
    setApiData(data);
    if (data.transcription && data.transcription.comando === "agregar") {
      navigate("/agregar");
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  //autenciador logout y username
  const { logout, user } = useAuth();

  //seleccionador
  const [selectedBodega, setSelectedBodega] = useState("");

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedNombre = bodegas.find(
      (bodega) => bodega._id === selectedId
    ).nombrebodega;
    setSelectedBodega({ id: selectedId, nombre: selectedNombre });
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        {" "}
        <h1 className="menu-title">Menu Principal</h1>{" "}
        <Link to="/" onClick={() => logout()}>
          <div className="menu-button">
            {" "}
            <FontAwesomeIcon icon={faSignOut} />
          </div>
        </Link>
      </nav>
      <div>Bienvenido {user.username}</div>
      <div className="App">
        {modal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <AddBodegaPage closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>

      <div
        className="container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <select
          value={selectedBodega.id}
          onChange={handleSelectChange}
          className="select"
        >
          <option value="">Selecciona una bodega</option>
          {bodegas.map((bodega) => (
            <option key={bodega._id} value={bodega._id}>
              {bodega.nombrebodega}
            </option>
          ))}
        </select>
        <button onClick={openModal}>Abrir Ventana Emergente</button>
      </div>

      <div className="icon-container">
        <Link to="/agregar">
          <FontAwesomeIcon className="icon" icon={faHome} />
        </Link>
        <FontAwesomeIcon className="icon" icon={faUser} />
        <FontAwesomeIcon className="icon" icon={faCog} />
      </div>
      <div>
        <AudioRecorder onApiResponse={handleApiResponse} />
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

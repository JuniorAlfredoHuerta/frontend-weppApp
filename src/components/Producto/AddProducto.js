// AgregarProducto.js
import React, { useEffect, useState } from "react";
import "./AddProducto.css";
import AudioRecorder from "../../VoiceRecognition/audiocapture";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useStock } from "../context/AddContext";

function AgregarProducto() {
  const [apiData, setApiData] = useState(null);
  const [producto, setProducto] = useState({
    nombre: "",
    cantidad: "",
    precio: "",
  });

  const handleApiResponse = (data) => {
    setApiData(data);
  };
  console.log(apiData);

  useEffect(() => {
    if (apiData && apiData.transcription && apiData.transcription.precio) {
      setProducto({
        ...producto,
        nombre: apiData.transcription.nombre_producto,
        cantidad: apiData.transcription.cantidad,
        precio: apiData.transcription.precio,
      });
    }
  }, [apiData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value,
    });
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        {" "}
        {/* Aplica la clase menu-nav */}
        <h1 className="menu-title">Agregar Producto</h1>{" "}
        {/* Aplica la clase menu-title */}
        <Link to="/mainmenu">
          <div className="menu-button">
            {" "}
            {/* Aplica la clase menu-button */}
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={
              apiData && apiData.transcription
                ? apiData.transcription.nombre_producto || producto.nombre
                : producto.nombre
            }
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="text"
            id="cantidad"
            name="cantidad"
            value={
              apiData && apiData.transcription
                ? apiData.transcription.cantidad || producto.cantidad
                : producto.cantidad
            }
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <input
            type="text"
            id="precio"
            name="precio"
            value={
              apiData && apiData.transcription
                ? apiData.transcription.precio || producto.precio
                : producto.precio
            }
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faPlus} /> Agregar Producto
        </button>
      </form>
      <div>
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default AgregarProducto;

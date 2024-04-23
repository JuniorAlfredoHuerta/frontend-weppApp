import { Link, useParams } from "react-router-dom";
import { useStock } from "../../context/AddContext";
import React, { useEffect, useState } from "react";
import "./stockPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import { useForm } from "react-hook-form";

function StockPage() {
  const { register, handleSubmit, reset, setValue } = useForm(); // Agrega setValue
  const { id } = useParams();
  const { stocks, getStock, updateStock } = useStock();
  const [producto, setProducto] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStock(id);
        setProducto(res);
        // Actualiza los valores del formulario cuando se obtiene el producto
        setValue("nombre", res.nombre);
        setValue("cantidad", res.cantidad);
        setValue("preciocompra", res.preciocompra);
        setValue("precioventa", res.precioventa);
        setValue("ubicacion", res.ubicacion);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, getStock, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    await updateStock(id, data);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  });

  const handleApiResponse = (data) => {
    // Actualiza el estado del producto con los datos de la API
    setProducto((prevProducto) => ({
      ...prevProducto,
      cantidad: parseInt(prevProducto.cantidad) + parseInt(data.transcription.cantidad),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value,
    });
  };

  const openInfo = () => {
    setInfo(true);
  };

  const closeInfo = () => {
    setInfo(false);
  };

  const closeMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Buscar Producto</h1>{" "}
        <div className="button-help" onClick={openInfo}>
          AYUDA
        </div>
        <Link to="/buscar">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      {info && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeInfo}>
              &times;
            </span>{" "}
            <div className="texto-grande">
              Los comandos de voz para esta pagina son:
            </div>
            <div className="texto-grande">Añadir "Cantidad"</div>
            <div>Añade la cantidad dicha al stock</div>
            <div>Para salidas del producto vaya a Registro de Ventas</div>
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} className="form-css">
        <h3> Actualiza los datos del producto</h3>
        <label>Nombre del producto</label>
        <input
  type="text"
  {...register("nombre", { required: true })}
  value={producto.nombre || ""} // Asegura que el valor inicial sea una cadena vacía
  className="registro-inputs"
  onChange={handleChange}
></input>

        <label>Cantidad en el almacen</label>
        <input
          type="text"
          {...register("cantidad", { required: true })}
          value={producto.cantidad || ""}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <label>Precio de compra</label>
        <input
          type="text"
          {...register("preciocompra", { required: true })}
          value={producto.preciocompra || ""}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <label>Precio de venta</label>
        <input
          type="text"
          {...register("precioventa", { required: true })}
          value={producto.precioventa || ""}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <label>Ubicacion del producto</label>
        <input
          type="text"
          {...register("ubicacion")}
          value={producto.ubicacion || ""}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <button type="submit">Actualizar</button>
      </form>
      {showSuccessMessage && (
        <div className="success-message">
          <span className="close" onClick={closeMessage}>
            &times;
          </span>
          <p>El producto fue correctamente actualizado.</p>
        </div>
      )}

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default StockPage;

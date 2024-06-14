import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useStock } from "../../context/AddContext";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import "./stockPage.css";

function StockPage() {
  const { id } = useParams();
  const { getStock, updateStock, deleteStock } = useStock();
  const { register, handleSubmit, setValue } = useForm();
  const [producto, setProducto] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStock(id);
        setProducto(res);
        setValue("nombre", res.nombre || "");
        setValue("cantidad", res.cantidad || "");
        setValue("preciocompra", res.preciocompra || "");
        setValue("precioventa", res.precioventa || "");
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, getStock, setValue]);

  const onSubmit = async (data) => {
    //console.log(data);
    await updateStock(id, data);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleApiResponse = (data) => {
    if (data.transcription.comando === "eliminar") {
      handleDelete();
    } else {
      const cantidadToAdd = parseInt(data.transcription.cantidad);
      setProducto((prevProducto) => ({
        ...prevProducto,
        cantidad: parseInt(prevProducto.cantidad) + cantidadToAdd,
      }));

      // Actualizar el valor del campo "cantidad" en el formulario
      setValue("cantidad", producto.cantidad + cantidadToAdd);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
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

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteStock(id);
      window.location.href = "/buscar";
    }
  };
  const [resourceError, setResourceError] = useState(false);

  const handleResourceError = () => {
    setResourceError(true);
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
      <div className="menu-button trash-button" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </div>
      {info && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeInfo}>
              &times;
            </span>{" "}
            <div className="texto-grande">
              Los comandos de voz para esta página son:
            </div>
            <div className="texto-grande">Añadir "Cantidad"</div>
            <div>Añade la cantidad dicha al stock</div>
            <div>Para salidas del producto vaya a Registro de Ventas</div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="form-css">
        <h3>Actualizar los datos del producto</h3>
        <label>Nombre del producto</label>
        <input
          type="text"
          {...register("nombre", { required: true })}
          value={producto.nombre || ""}
          className="registro-inputs"
          onChange={handleChange}
        />

        <label>Cantidad en el almacén</label>
        <input
          type="text"
          {...register("cantidad", { required: true })}
          value={producto.cantidad || ""}
          className="registro-inputs"
          onChange={handleChange}
        />

        <label>Precio de compra</label>
        <input
          type="text"
          {...register("preciocompra", { required: true })}
          value={producto.preciocompra || ""}
          className="registro-inputs"
          onChange={handleChange}
        />

        <label>Precio de venta</label>
        <input
          type="text"
          {...register("precioventa", { required: true })}
          value={producto.precioventa || ""}
          className="registro-inputs"
          onChange={handleChange}
        />

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
      {resourceError && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setResourceError(false)}>
              &times;
            </span>
            <div className="texto-grande">Error de Carga de Recursos</div>
            <div>
              Ha ocurrido un error al cargar los recursos. Por favor, inténtelo
              de nuevo más tarde.
            </div>
          </div>
        </div>
      )}

      <div className="audio-recorder">
        <AudioRecorder
          onApiResponse={handleApiResponse}
          onError={handleResourceError}
        />
      </div>
    </div>
  );
}

export default StockPage;

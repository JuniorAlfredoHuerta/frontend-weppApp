import { Link, useParams } from "react-router-dom";
import { useStock } from "../../context/AddContext";
import React, { useEffect, useState } from "react";
import "./stockPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import { useForm } from "react-hook-form";

function StockPage() {
  const { register, handleSubmit, reset } = useForm();

  const { id } = useParams();
  const { stocks, getStock, updateStock } = useStock();
  const [apiData, setApiData] = useState(null);
  const [producto, setProducto] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStock(id);
        setProducto(res);
      } catch (error) {
        // Manejo de errores
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, getStock]);

  //if (!selectedProduct) {
  //  return <div>Loading...</div>;
  //}
  const onSubmit = handleSubmit(async (data) => {
    await updateStock(id, data);
  });
  const handleApiResponse = (data) => {
    setApiData(data);
    if (data && data.transcription && data.transcription.cantidad) {
      const cantidadFromAPI = data.transcription.cantidad;
      setProducto((prevProducto) => ({
        ...prevProducto,
        cantidad: parseInt(producto.cantidad) + parseInt(cantidadFromAPI),
      }));
    }
  };

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
        <h1 className="menu-title">Buscar Producto</h1>{" "}
        <Link to="/buscar">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <form onSubmit={onSubmit} className="form-css">
        <label>Nombre del producto</label>
        <input
          type="text"
          {...register("nombre", { required: true })}
          value={producto.nombre}
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
          value={producto.preciocompra}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <label>Precio de venta</label>

        <input
          type="text"
          {...register("precioventa", { required: true })}
          value={producto.precioventa}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <label>Ubicacion del producto</label>

        <input
          type="text"
          {...register("ubicacion")}
          value={producto.ubicacion}
          className="registro-inputs"
          onChange={handleChange}
        ></input>
        <button type="submit">Actualizar</button>
      </form>

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}
export default StockPage;
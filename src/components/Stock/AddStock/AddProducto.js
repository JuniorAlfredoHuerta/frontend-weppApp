import { useForm } from "react-hook-form";
import { useStock } from "../../context/AddContext";
import "./AddProducto.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import { useEffect, useState } from "react";
import Select from "react-select";

function Agregarstock() {
  const { register, handleSubmit, reset } = useForm();
  const [producto, setProducto] = useState({
    nombre: "",
    cantidad: "",
    preciocompra: "",
    precioventa: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const closeMessage = () => {
    setShowSuccessMessage(false);
  };
  const [apiData, setApiData] = useState(null);
  const { createStock, stocks, getStocks, updateStock } = useStock();
  const [productoCreado, setProductoCreado] = useState(null); // Estado para almacenar el producto creado

  useEffect(() => {
    getStocks();
  }, [stocks]);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    //console.log(data);
    //console.log(stocks);
    const existioproducto = stocks.find(
      (stock) => stock.nombre === data.nombre
    );

    if (existioproducto) {
      //aqui tendria que sumar existioproducto.cantidad con data.cantidad y remplazarla en data
      const cantidadExistente = existioproducto.cantidad || 0;
      const cantidadNueva = data.cantidad || 0;
      const nuevaCantidad =
        parseInt(cantidadExistente) + parseInt(cantidadNueva);

      updateStock(existioproducto._id, { ...data, cantidad: nuevaCantidad });
    } else {
      console.log(data);
      createStock(data);
    }
    setProductoCreado(data);
    setShowSuccessMessage(true);
    reset();
    clearFormFields();
  });
  const clearFormFields = () => {
    setProducto({
      nombre: "",
      cantidad: "",
      preciocompra: "",
      precioventa: "",
    });
  };

  const handleApiResponse = (data) => {
    setApiData(data);
    if (data.transcription && data.transcription.comando === "agregar") {
      navigate("/agregar");
    }
  };

  // Map de stocks para opciones de react-select

  useEffect(() => {
    if (apiData && apiData.transcription) {
      const newProducto = {
        nombre: apiData.transcription.nombre_producto || producto.nombre,
        cantidad: apiData.transcription.cantidad || producto.cantidad,
        preciocompra: apiData.transcription.precio || producto.preciocompra,
        precioventa: producto.precioventa,
      };

      setProducto(newProducto);
      reset(newProducto);
    }
  }, [apiData, reset]);

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
        <h1 className="menu-title">Agregar Producto</h1>{" "}
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <form onSubmit={onSubmit} className="form-css">
        <input
          type="text"
          {...register("nombre", { required: true })}
          placeholder=" Nombre del producto"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.nombre_producto || producto.nombre
              : producto.nombre
          }
          onChange={handleChange}
        ></input>
        <input
          type="text"
          {...register("cantidad", { required: true })}
          placeholder=" Cantidad"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.cantidad || producto.cantidad
              : producto.cantidad
          }
          onChange={handleChange}
        ></input>
        <input
          type="text"
          {...register("preciocompra", { required: true })}
          placeholder=" Precio de compra"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.precio || producto.preciocompra
              : producto.preciocompra
          }
          onChange={handleChange}
        ></input>
        <input
          type="text"
          {...register("precioventa", { required: true })}
          placeholder=" Precio de venta"
          className="registro-inputs"
          onChange={handleChange}
        ></input>

        <button type="submit">Registrar Producto</button>
      </form>
      {showSuccessMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <p>Producto creado: </p>
            <p>Nombre: {productoCreado.nombre}</p>
            <p>Cantidad: {productoCreado.cantidad}</p>
            <p>Precio de compra: $ {productoCreado.preciocompra}</p>
            <p>Precio de venta: $ {productoCreado.precioventa}</p>
            {/* Agrega otros detalles del producto aquí según sea necesario */}
          </div>
        </div>
      )}
      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default Agregarstock;

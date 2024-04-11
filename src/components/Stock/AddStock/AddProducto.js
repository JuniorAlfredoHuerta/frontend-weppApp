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
  const [previacan, setPreviacan] = useState("");
  const [nuevacan, setNuevacan] = useState("");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessageE, setShowSuccessMessageE] = useState(false);

  const closeMessage = () => {
    setShowSuccessMessageE(false);
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
      setPreviacan(cantidadExistente);
      const cantidadNueva = data.cantidad || 0;
      const nuevaCantidad =
        parseInt(cantidadExistente) + parseInt(cantidadNueva);
      setNuevacan(nuevaCantidad);
      updateStock(existioproducto._id, { ...data, cantidad: nuevaCantidad });
      setShowSuccessMessageE(true);
    } else {
      //console.log(data);
      createStock(data);
      setShowSuccessMessage(true);
    }
    setProductoCreado(data);
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
  };

  const isFormFilled = () => {
    return (
      producto.nombre &&
      producto.cantidad &&
      producto.preciocompra &&
      producto.precioventa
    );
  };

  useEffect(() => {
    if (apiData && apiData.transcription) {
      console.log(apiData);
      const newProducto = {
        nombre: apiData.transcription.nombre_producto || producto.nombre,
        cantidad: apiData.transcription.cantidad || producto.cantidad,
        preciocompra: apiData.transcription.precio ||   producto.preciocompra,
        precioventa: apiData.transcription.precio * 1.20   ||  producto.precioventa ,

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
        <label>Nombre del producto</label>
        <input
          type="text"
          {...register("nombre")}
          placeholder=" Nombre del producto"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.nombre_producto || producto.nombre
              : producto.nombre
          }
          onChange={handleChange}
        ></input>
        <label>Cantidad a ingresar</label>

        <input
          type="text"
          {...register("cantidad")}
          placeholder=" Cantidad"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.cantidad || producto.cantidad
              : producto.cantidad
          }
          onChange={handleChange}
        ></input>
        <label>Precio de compra</label>

        <input
          type="text"
          {...register("preciocompra")}
          placeholder=" Precio de compra"
          className="registro-inputs"
          value={
            apiData && apiData.transcription
              ? apiData.transcription.precio || producto.preciocompra
              : producto.preciocompra
          }
          onChange={handleChange}
        ></input>
        <label>Precio de Venta</label>

        <input
          type="text"
          {...register("precioventa")}
          placeholder=" Precio de venta"
          className="registro-inputs"
          onChange={handleChange}
        ></input>

        <button
          type="submit"
          disabled={!isFormFilled()}
          style={{ backgroundColor: !isFormFilled() ? "lightgrey" : "blue" }}
        >
          Registrar Producto
        </button>
      </form>
      {showSuccessMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <p>Nombre: {productoCreado.nombre}</p>
            <p>Cantidad: {productoCreado.cantidad}</p>
            <p>Precio de compra: $ {productoCreado.preciocompra}</p>
            <p>Precio de venta: $ {productoCreado.precioventa}</p>
          </div>
        </div>
      )}
      {showSuccessMessageE && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <p>Nombre: {productoCreado.nombre}</p>
            <p>Cantidad Previa: {previacan}</p>
            <p>Cantidad Nueva: {nuevacan}</p>
            <p>Precio de compra: $ {productoCreado.preciocompra}</p>
            <p>Precio de venta: $ {productoCreado.precioventa}</p>
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

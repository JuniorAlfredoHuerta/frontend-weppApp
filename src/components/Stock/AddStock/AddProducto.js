import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStock } from "../../context/AddContext";
import "./AddProducto.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";

function Agregarstock() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createStock, stocks, getStocks, updateStock } = useStock();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessageE, setShowSuccessMessageE] = useState(false);
  const [productoCreado, setProductoCreado] = useState(null);
  const [previacan, setPreviacan] = useState("");
  const [nuevacan, setNuevacan] = useState("");
  const [apiData, setApiData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [info, setInfo] = useState(false);

  useEffect(() => {
    getStocks();
  }, [stocks]);

  const openInfo = () => {
    setInfo(true);
  };

  const closeInfo = () => {
    setInfo(false);
  };

  const closeMessage = () => {
    setShowSuccessMessageE(false);
    setShowSuccessMessage(false);
  };

  const onSubmit = async (data) => {
    const { nombre, cantidad, preciocompra, precioventa } = data;

    if (!nombre || !cantidad || !preciocompra || !precioventa) {
      // Si algún campo está vacío, no se envía el formulario
      return;
    }

    if (
      !isValidInteger(cantidad) ||
      !isValidNumber(preciocompra) ||
      !isValidNumber(precioventa)
    ) {
      // Si algún campo numérico no es válido, se muestran los errores
      setFormErrors({
        cantidad: isValidInteger(cantidad) ? "" : "Debe ser un número válido.",
        preciocompra: isValidNumber(preciocompra)
          ? ""
          : "Debe ser un número válido.",
        precioventa: isValidNumber(precioventa)
          ? ""
          : "Debe ser un número válido.",
      });
      return;
    }

    const existioproducto = stocks.find((stock) => stock.nombre === nombre);

    if (existioproducto) {
      const cantidadExistente = existioproducto.cantidad || 0;
      setPreviacan(cantidadExistente);

      const cantidadNueva = parseInt(cantidadExistente) + parseInt(cantidad);
      setNuevacan(cantidadNueva);

      updateStock(existioproducto._id, { ...data, cantidad: cantidadNueva });
      setShowSuccessMessageE(true);
    } else {
      createStock(data);
      setShowSuccessMessage(true);
    }

    setProductoCreado(data);
    setApiData(null);
    resetForm();
  };

  const isValidInteger = (value) => {
    return !isNaN(value) && Number.isInteger(Number(value));
  };

  const isValidNumber = (value) => {
    return !isNaN(value) && isFinite(value);
  };

  useEffect(() => {
    if (apiData && apiData.transcription) {
      const newProducto = {
        nombre: apiData.transcription.nombre_producto || "",
        cantidad: apiData.transcription.cantidad || "",
        preciocompra: apiData.transcription.precio || "",
        precioventa: apiData.transcription.precio * 1.2 || "",
      };
      reset(newProducto);
    }
  }, [apiData, reset]);

  const resetForm = () => {
    reset({
      nombre: "",
      cantidad: "",
      preciocompra: "",
      precioventa: "",
    });
    setFormErrors({});
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Agregar Producto</h1>{" "}
        <div className="button-help" onClick={openInfo}>
          AYUDA
        </div>
        <Link to="/mainmenu">
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
            <div>
              Para agregar un producto en esta pagina necesitaras decir el
              comando de la siguiente forma
            </div>
            <div className="texto-grande">Compre + </div>
            <div className="texto-grande">"Cantidad numerica " + </div>
            <div className="texto-grande">"Nombre del producto" + </div>
            <div className="texto-grande">Costo + </div>
            <div className="texto-grande">"Precio invidiual del producto" </div>
            <div className="texto-grande">Ejemplo: </div>
            <div>Compre cinco Inka Kola costo dos soles cincuenta</div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="form-css">
        <label>Nombre del producto</label>
        <input
          type="text"
          {...register("nombre", { required: true })}
          placeholder="Nombre del producto"
          className="registro-inputs"
        />
        {errors.nombre && <p className="redto">Campo requerido</p>}

        <label>Cantidad a ingresar</label>
        <input
          type="text"
          {...register("cantidad", { required: true })}
          placeholder="Cantidad"
          className="registro-inputs"
        />
        {errors.cantidad && <p className="redto">Campo requerido</p>}
        {formErrors.cantidad && <p className="redto">{formErrors.cantidad}</p>}

        <label>Precio de compra</label>
        <input
          type="text"
          {...register("preciocompra", { required: true })}
          placeholder="Precio de compra"
          className="registro-inputs"
        />
        {errors.preciocompra && <p className="redto">Campo requerido</p>}
        {formErrors.preciocompra && (
          <p className="redto">{formErrors.preciocompra}</p>
        )}

        <label>Precio de Venta</label>
        <input
          type="text"
          {...register("precioventa", { required: true })}
          placeholder="Precio de venta"
          className="registro-inputs"
        />
        {errors.precioventa && <p className="redto">Campo requerido</p>}
        {formErrors.precioventa && (
          <p className="redto">{formErrors.precioventa}</p>
        )}

        <button type="submit">Registrar Producto</button>
      </form>
      {showSuccessMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <div className="texto-grande">El Producto fue creado</div>
            <p>Nombre: {productoCreado.nombre}</p>
            <p>Cantidad: {productoCreado.cantidad}</p>
            <p>Precio de compra: S/. {productoCreado.preciocompra}</p>
            <p>Precio de venta: S/. {productoCreado.precioventa}</p>
          </div>
        </div>
      )}
      {showSuccessMessageE && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <div className="texto-grande" >El Producto fue modificado</div>
            <p>Nombre: {productoCreado.nombre}</p>
            <p>Cantidad Previa: {previacan}</p>
            <p>Cantidad Nueva: {nuevacan}</p>
            <p>Precio de compra: S/. {productoCreado.preciocompra}</p>
            <p>Precio de venta: S/. {productoCreado.precioventa}</p>
          </div>
        </div>
      )}{" "}
      <div className="audio-recorder">
        <AudioRecorder onApiResponse={setApiData} />
      </div>
    </div>
  );
}

export default Agregarstock;

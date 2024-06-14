import { Link } from "react-router-dom";
import "./crearVenta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlusCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import { useEffect, useState } from "react";
import SelectProducto from "./selectProducto";
import { useStock } from "../../context/AddContext";
import { useVenta } from "../../context/VentaContext";

function CreateVentaPage() {
  const [apiData, setApiData] = useState(null);
  const [appProductos, setAppProductos] = useState([]);
  const { createVenta } = useVenta();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { stocks, getStocks, updateStock } = useStock();

  const [info, setinfo] = useState(false);
  const openInfo = () => {
    setinfo(true);
  };

  const closeInfo = () => {
    setinfo(false);
  };

  useEffect(() => {
    getStocks();
  }, []);

  const stocksConCantidad = stocks.filter((stock) => stock.cantidad > 0);

  const handleApiResponse = (data) => {
    setApiData(data);
    //console.log(data);

    const product = stocksConCantidad.find(
      (product) => product.nombre === data.transcription.nombre_producto
    );

    const nuevoProducto = {
      _id: product._id,
      nombre: data.transcription.nombre_producto,
      cantidad: data.transcription.cantidad,
    };

    setAppProductos([...appProductos, nuevoProducto]);
  };

  const handleAddProducto = () => {
    if (appProductos.length < stocksConCantidad.length) {
      setAppProductos([
        ...appProductos,
        { _id: null, cantidad: "", precioVenta: "", total: "" },
      ]);
    }
  };
  const closeMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleProductoChange = (producto, index) => {
    const updatedProductos = [...appProductos];
    updatedProductos[index] = producto;
    setAppProductos(updatedProductos);

    if (updatedProductos) {
    }
  };
  const handleRemoveProducto = (index) => {
    const updatedProductos = appProductos.filter((_, i) => i !== index);
    setAppProductos(updatedProductos);
  };

  const SubmitData = async () => {
    const productosSinId = appProductos.map(({ _id, total, ...rest }) => rest);
    const precioTotal = appProductos.reduce(
      (total, producto) => parseFloat(total) + parseFloat(producto.total),
      0
    );

    const nuevoFormato = {
      productos: productosSinId,
      preciototal: precioTotal,
    };

    const stocktotupdate = appProductos.map(
      ({ nombre, precioVenta, total, ...rest }) => rest
    );
    ////console.log(stocktotupdate);
    for (let i = 0; i < stocktotupdate.length; i++) {
      const stocktest = stocktotupdate.find(
        (stocktest) => stocktest._id === stocktotupdate[i]._id
      );
      const realstock = stocks.find(
        (realstock) => realstock._id === stocktotupdate[i]._id
      );

      ////console.log(stocks)
      ////console.log(realstock.cantidad)
      ////console.log(stocktest.cantidad);
      const stockleft =
        parseInt(realstock.cantidad) - parseInt(stocktest.cantidad);
      updateStock(stocktotupdate[i]._id, { cantidad: stockleft });
    }

    console.log(nuevoFormato);
    createVenta(nuevoFormato);
    setShowSuccessMessage(true);
    setAppProductos([]);
    setApiData(null);
  };

  const isButtonDisabled = () => {
    if (appProductos.length !== 0) {
      if (appProductos[0].nombre) {
        return false;
      }
    }
    return true;
  };

  const [resourceError, setResourceError] = useState(false);

  const handleResourceError = () => {
    setResourceError(true);
  };
  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Venta de Producto</h1>{" "}
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
              Para agregar una venta en esta pagina necesitaras decir el comando
              de la siguiente forma
            </div>
            <div className="texto-grande">Vendi + </div>
            <div className="texto-grande">"Cantidad numerica " + </div>{" "}
            <div className="texto-grande">Producto + </div>
            <div className="texto-grande">"Nombre del producto" + </div>
            <div className="texto-grande">Salio + </div>
            <div className="texto-grande">"Precio de venta total" </div>
            <div className="texto-grande">Ejemplo: </div>{" "}
            <div>Vendi cinco producto Inka Kola costo doce soles cincuenta</div>
          </div>
        </div>
      )}
      <div className="contenedor">
        <h3>Añada un producto para la venta</h3>
        <div className="iconplus" onClick={handleAddProducto}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </div>
      </div>
      <div className="labels-container">
        <label style={{ position: "relative", left: "10px" }}>Producto</label>
        <label style={{ position: "relative", left: "40px" }}>Cantidad</label>
        <label style={{ position: "relative", left: "40px" }}>Precio</label>
        <label style={{ position: "relative", left: "40px" }}>Total</label>
        <div></div>
      </div>
      <div className="adiciones">
        {appProductos.map((producto, index) => (
          <div className="select-producto" key={index}>
            <SelectProducto
              onProductoChange={(data) => handleProductoChange(data, index)}
              apiData={apiData}
            />
            <div onClick={() => handleRemoveProducto(index)}>X</div>
          </div>
        ))}
      </div>
      {showSuccessMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMessage}>
              &times;
            </span>
            <p> La venta ha sido creada exitosamente</p>
          </div>
        </div>
      )}
      <div className="buttonji">
        <button
          onClick={SubmitData}
          disabled={isButtonDisabled()}
          style={{
            backgroundColor: isButtonDisabled() ? "lightgrey" : "blue",
          }}
        >
          Registrar
        </button>
      </div>
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

export default CreateVentaPage;

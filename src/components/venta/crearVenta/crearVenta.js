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
  const [stockeado, setStockeado] = useState([]);
  const { createVenta } = useVenta();

  const { stocks, getStocks, updateStock } = useStock();

  useEffect(() => {
    getStocks();
  }, []);

  const stocksConCantidad = stocks.filter((stock) => stock.cantidad > 0);

  const handleApiResponse = (data) => {
    setApiData(data);
  };

  const handleAddProducto = () => {
    if (appProductos.length < stocksConCantidad.length) {
      setAppProductos([
        ...appProductos,
        { productId: null, cantidad: "", precioVenta: "", total: "" },
      ]);
    }
  };

  const handleProductoChange = (producto, index) => {
    const updatedProductos = [...appProductos];
    updatedProductos[index] = producto;
    setAppProductos(updatedProductos);

    // Agregar un console.log para verificar los datos actualizados
    console.log("Datos del producto actualizados:", updatedProductos);
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
    for (let i = 0; i < stocktotupdate.length; i++) {
      const stocktest = stocksConCantidad.find(
        (stocktest) => stocktest._id === stocktotupdate[i]._id
      );
      const stockleft =
        parseInt(stocktest.cantidad) - parseInt(stocktotupdate[i].cantidad);
      updateStock(stocktotupdate[i]._id, { cantidad: stockleft });
    }
    createVenta(nuevoFormato);
  };
  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Venta de Producto</h1>{" "}
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
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
            />
            <div onClick={() => handleRemoveProducto(index)}>X</div>
          </div>
        ))}
      </div>
      <div className="buttonji">
        <button onClick={SubmitData}> Registrar </button>
      </div>

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default CreateVentaPage;

import { useEffect, useState } from "react";
import { useStock } from "../../context/AddContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faIcons,
  faList,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import "./searchstock.css";
import jsPDF from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { useBodega } from "../../context/BodegaContext";
import Cookies from "js-cookie";

function SearchStock() {
  const { getStocks, stocks, deleteStock } = useStock();
  const [apiData, setApiData] = useState(null);
  const { logout, user } = useAuth();

  const navigate = useNavigate();
  const { getBodegas, bodegas, gettokenbodega, calltokenbodega } = useBodega();

  const [info, setinfo] = useState(false);
  const openInfo = () => {
    setinfo(true);
  };

  const closeInfo = () => {
    setinfo(false);
  };
  useEffect(() => {
    getStocks();
  }, [getStocks]);

  const handleApiResponse = (data) => {
    setApiData(data);
    const foundProduct = stocks.find(
      (product) => product.nombre === data.transcription.nombre_producto
    );
    if (foundProduct) {
      const idproducto = foundProduct._id;
      navigate(`/producto/${idproducto}`);
    }
    if (data.transcription.comando === "descargar") {
      generatePDF();
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleVentanaDelete = (productname, productId) => {
    setselectedProduct(productname);
    setselectedProductid(productId);

    setShowConfirmation(true);
  };
  const handlecloseVentanaDelete = () => {
    setShowConfirmation(false);
  };
  const handleDelete = async (productId) => {
    await deleteStock(productId);
    setShowConfirmation(false);
    navigate("/buscar");
  };

  const [selectedProduct, setselectedProduct] = useState(false);
  const [selectedProductid, setselectedProductid] = useState(false);

  const generatePDF = async () => {
    const bodegatok = await calltokenbodega();

    const doc = new jsPDF();
    let y = 20;

    // Nombre del usuario y nombre de la bodega
    doc.text(`Usuario: ${user.username}`, 10, y);
    doc.text(`Bodega: ${bodegatok.data.nombre}`, 10, y + 10);
    y += 30;

    doc.line(10, y - 10, 10, y); // Línea izquierda
    doc.line(50, y - 10, 50, y); // Línea entre columnas
    doc.line(100, y - 10, 100, y); // Línea entre columnas
    doc.line(150, y - 10, 150, y); // Línea entre columnas
    doc.line(200, y - 10, 200, y); // Línea derecha
    doc.line(10, y - 10, 200, y - 10); // Línea superior
    doc.line(10, y, 200, y); // Línea inferior
    // Encabezados de la tabla
    doc.text("Producto", 15, y - 3);
    doc.text("Cantidad", 65, y - 3);
    doc.text("Precio de Compra S/.", 105, y - 3);
    doc.text("Total S/.", 165, y - 3);
    y += 10;

    // Contenido de la tabla
    stocks.forEach((product) => {
      doc.line(10, y - 10, 10, y); // Línea izquierda
      doc.line(50, y - 10, 50, y); // Línea entre columnas
      doc.line(100, y - 10, 100, y); // Línea entre columnas
      doc.line(150, y - 10, 150, y); // Línea entre columnas
      doc.line(200, y - 10, 200, y); // Línea derecha
      doc.line(10, y - 10, 200, y - 10); // Línea superior
      doc.line(10, y, 200, y); // Línea inferior

      doc.text(product.nombre, 15, y - 3);
      doc.text(product.cantidad.toString(), 65, y - 3);
      doc.text(product.preciocompra.toString(), 105, y - 3);
      doc.text(
        (product.cantidad * product.preciocompra).toString(),
        165,
        y - 3
      );
      y += 10;
    });

    // Total de totales
    const totalCantidad = stocks.reduce(
      (total, product) => total + product.cantidad,
      0
    );
    const totalPrecioCompra = stocks.reduce(
      (total, product) => total + product.cantidad * product.preciocompra,
      0
    );

    doc.text(`Total Cantidad:`, 10, y + 10);
    doc.text(`Total Precio de Compra:`, 10, y + 20);
    doc.text(`S/. ${totalCantidad}`, 165, y + 10);
    doc.text(`S/. ${totalPrecioCompra}`, 165, y + 20);
    doc.save("lista_productos.pdf");
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Buscar Producto</h1>{" "}
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
            <div className="texto-grande">"Nombre del Producto"</div>
            <div>Te dirije al detalle producto que deseas buscar</div>
            <div className="texto-grande">Descagar</div>
            <div>Descarga el detalle del INVENTARIO como formato PDF</div>
          </div>
        </div>
      )}
      <div>
        <h1 style={{ marginLeft: "10px" }}>Lista de Productos</h1>
        <div className="product-container">
          {stocks.map((product, index) => (
            <div className="product-link" key={index}>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleVentanaDelete(product.nombre, product._id)}
              />
              <Link to={`/producto/${product._id}`}>
                <div>
                  <div style={{ textAlign: "center" }}>
                    <FontAwesomeIcon
                      icon={faIcons}
                      style={{ marginBottom: "10px" }}
                    />
                    <div className="textname">Nombre: {product.nombre}</div>
                    <div className="textname">Cantidad: {product.cantidad}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {showConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <div className="confirmation-modal">
                <p>
                  ¿Estás seguro de que quieres eliminar {selectedProduct} del
                  registro?
                </p>
                <div className="button-container">
                  <button onClick={() => handleDelete(selectedProductid)}>
                    Sí, Eliminar
                  </button>
                  <button onClick={() => setShowConfirmation(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button onClick={generatePDF}>Descargar PDF</button>

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default SearchStock;

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
  }, []);

  const handleApiResponse = (data) => {
    setApiData(data);
    const foundProduct = stocks.find(
      (product) => product.nombre === data.transcription.nombre_producto
    );
    if (data.transcription.comando === "eliminar") {
      if (foundProduct) {
        handleVentanaDelete(foundProduct.nombre, foundProduct._id);
      }
    } else if (data.transcription.comando === "descargar") {
      generatePDF();
    } else {
      if (foundProduct) {
        const idproducto = foundProduct._id;
        navigate(`/producto/${idproducto}`);
      }
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
    window.location.href = "/buscar";
  };

  const [selectedProduct, setselectedProduct] = useState(false);
  const [selectedProductid, setselectedProductid] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const generatePDF = async () => {
    const bodegatok = await calltokenbodega();

    const doc = new jsPDF();
    let y = 20;

    // Nombre del usuario y nombre de la bodega
    doc.text(`Usuario: ${user.username}`, 10, y);
    doc.text(`Bodega: ${bodegatok.data.nombre}`, 10, y + 10);
    y += 30;

    // Encabezados de la tabla
    doc.text("Producto", 15, y - 3);
    doc.text("Cantidad", 65, y - 3);
    doc.text("Precio de Compra S/.", 105, y - 3);
    doc.text("Total S/.", 165, y - 3);
    y += 10;

    // Verificar si hay productos seleccionados
    let productsToInclude = stocks;
    if (selectedProducts.length > 0) {
      // Si hay productos seleccionados, filtrar solo esos productos
      productsToInclude = stocks.filter((product) =>
        selectedProducts.includes(product._id)
      );
    }

    // Contenido de la tabla
    productsToInclude.forEach((product) => {
      const productNameLines = doc.splitTextToSize(product.nombre, 40); // Ajusta el ancho máximo de la celda según sea necesario
      const cellHeight = 10 * productNameLines.length; // Altura de la celda basada en la cantidad de líneas de texto

      doc.line(10, y - 10, 10, y + cellHeight - 10); // Línea izquierda
      doc.line(50, y - 10, 50, y + cellHeight - 10); // Línea entre columnas
      doc.line(100, y - 10, 100, y + cellHeight - 10); // Línea entre columnas
      doc.line(150, y - 10, 150, y + cellHeight - 10); // Línea entre columnas
      doc.line(200, y - 10, 200, y + cellHeight - 10); // Línea derecha
      doc.line(10, y - 10, 200, y - 10); // Línea superior
      doc.line(10, y + cellHeight - 10, 200, y + cellHeight - 10); // Línea inferior

      doc.text(productNameLines, 15, y - 3); // Texto del nombre del producto
      doc.text(product.cantidad.toString(), 65, y - 3);
      doc.text(product.preciocompra.toString(), 105, y - 3);
      doc.text(
        (product.cantidad * product.preciocompra).toString(),
        165,
        y - 3
      );
      y += cellHeight; // Incrementar `y` según la altura de la celda
    });

    // Total de totales
    const totalCantidad = productsToInclude.reduce(
      (total, product) => total + product.cantidad,
      0
    );
    const totalPrecioCompra = productsToInclude.reduce(
      (total, product) => total + product.cantidad * product.preciocompra,
      0
    );

    doc.text(`Total Precio de Compra:`, 10, y + 20);
    doc.text(`S/. ${totalPrecioCompra}`, 165, y + 20);
    doc.save("lista_productos.pdf");
  };

  const handleProductSelection = (event, productId) => {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
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
            <div className="texto-grande">Producto"</div>
            <div className="texto-grande">"Nombre del Producto"</div>
            <div>Te dirije al detalle producto que deseas buscar</div>{" "}
            <div>Ejemplo: Producto Inca Kola de 500 ml</div>
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
              <input
                type="checkbox"
                id={`product-${index}`}
                onChange={(e) => handleProductSelection(e, product._id)}
              />
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

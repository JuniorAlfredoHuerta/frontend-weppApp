import { useEffect, useState } from "react";
import { useStock } from "../../context/AddContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faIcons,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import "./searchstock.css";
import jsPDF from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { useBodega } from "../../context/BodegaContext";
import Cookies from "js-cookie";

function SearchStock() {
  const { getStocks, stocks } = useStock();
  const [apiData, setApiData] = useState(null);
  const { logout, user } = useAuth();

  const navigate = useNavigate();
  const { getBodegas, bodegas, gettokenbodega, calltokenbodega } = useBodega();

  useEffect(() => {
    getStocks();
  }, []);

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
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <div>
        <h1 style={{ marginLeft: "10px" }}>Lista de Productos</h1>
        <div className="product-container">
          {stocks.map((product, index) => (
            <Link
              key={index}
              to={`/producto/${product._id}`}
              className="product-link"
            >
              <div key={index}>
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
          ))}
        </div>
      </div>
      <button onClick={generatePDF}>Descargar PDF</button>

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default SearchStock;

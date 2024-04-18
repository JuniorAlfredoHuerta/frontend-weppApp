import { useEffect, useState } from "react";
import { useVenta } from "../../context/VentaContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import "./getVentas.css";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { useBodega } from "../../context/BodegaContext";

function GetVentas() {
  const [apiData, setApiData] = useState(null);
  const { logout, user } = useAuth();
  const { calltokenbodega } = useBodega();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [info, setinfo] = useState(false);
  const openInfo = () => {
    setinfo(true);
  };

  const closeInfo = () => {
    setinfo(false);
  };
  const { ventas, getVentas } = useVenta();
  useEffect(() => {
    getVentas();
  }, []);

  const handleApiResponse = (data) => {
    setApiData(data);
    if (data.transcription.comando === "descargar") {
      generatePDF();
    }
  };

  const filterSalesByDate = () => {
    if (startDate && endDate) {
      return ventas.filter((venta) => {
        const ventaDate = new Date(venta.createdAt);
        return ventaDate >= startDate && ventaDate <= endDate;
      });
    } else {
      return ventas;
    }
  };

  const filteredSales = filterSalesByDate();

  const generatePDF = async () => {
    const bodegatok = await calltokenbodega();

    const doc = new jsPDF();
    let y = 20;
    let totalPages = 1;
    let maxRowsPerPage = 20; // Cantidad máxima de filas por página
    let rows = 0;
    let userDetailsAdded = false;
    let totalSales = 0;

    const filteredSales = filterSalesByDate();

    const dateRange = `Rango de fechas: ${
      startDate ? startDate.toDateString() : ""
    } - ${endDate ? endDate.toDateString() : ""}`;

    // Mostrar detalles de usuario, bodega y rango de fechas al principio del documento
    doc.text(`Usuario: ${user.username}`, 10, y);
    doc.text(`Bodega: ${bodegatok.data.nombre}`, 10, y + 10);
    y += 20;
    doc.text(dateRange, 10, y);
    y += 20;
    userDetailsAdded = true;

    filteredSales.forEach((venta, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
        totalPages++;
      }

      doc.text(`Venta ${index + 1}`, 10, y + 3);
      doc.text(`S/. ${venta.preciototal}`, 140, y + 3);

      y += 10;

      doc.text("Producto", 10, y + 3);
      doc.text("Cantidad", 50, y + 3);
      doc.text("Precio Venta S/.", 90, y + 3);
      doc.text("Total S/.", 140, y + 3);

      y += 5;

      venta.productos.forEach((producto) => {
        if (rows >= maxRowsPerPage) {
          doc.addPage();
          y = 20;
          totalPages++;
          rows = 0;
        }

        doc.text(producto.nombre, 10, y + 3);
        doc.text(producto.cantidad.toString(), 50, y + 3);
        doc.text(producto.precioVenta.toString(), 90, y + 3);
        doc.text(
          (producto.cantidad * producto.precioVenta).toString(),
          140,
          y + 3
        );

        y += 10;
        rows++;
      });

      y += 10;
      rows = 0;
      totalSales += venta.preciototal; // Sumar el total de la venta a totalSales
    });

    doc.text(`Total de ventas: S/. ${totalSales}`, 10, y + 10); // Mostrar el total de las ventas al final del documento

    doc.save(`ventas.pdf`);
  };

  return (
    <div>
      <nav className="menu-nav">
        <h1 className="menu-title">Ventas realizadas</h1>{" "}
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
            <div className="texto-grande">Descagar</div>
            <div>Descarga el detalle de las VENTAS como formato PDF</div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: "100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="date"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            style={{ maxWidth: "150px", marginRight: "10px" }}
          />
          <input
            type="date"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            style={{ maxWidth: "150px" }}
          />
          <button onClick={generatePDF}>Descargar PDF</button>
        </div>
        <div className="ventas-container">
          {filteredSales.map((venta, index) => (
            <div key={index} className="venta-item">
              <h3>{format(new Date(venta.createdAt), "dd/MM/yyyy - HH:mm")}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Venta</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.productos.map((producto, pIndex) => (
                    <tr key={pIndex} className="producto-content">
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>S/. {producto.precioVenta}</td>
                      <td>S/. {producto.cantidad * producto.precioVenta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="precio-total">
                Precio Total de la Venta: S/.{" "}
                {venta.productos.reduce(
                  (total, producto) =>
                    total + producto.cantidad * producto.precioVenta,
                  0
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="audio-recorder">
          <AudioRecorder onApiResponse={handleApiResponse} />
        </div>
      </div>
    </div>
  );
}

export default GetVentas;

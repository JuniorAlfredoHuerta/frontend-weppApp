import { useEffect, useState } from "react";
import { useVenta } from "../../context/VentaContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import "./getVentas.css";
import { format } from "date-fns";

function GetVentas() {
  const [apiData, setApiData] = useState(null);

  const { ventas, getVentas } = useVenta();
  useEffect(() => {
    getVentas();
  }, []);

  console.log(ventas);
  const handleApiResponse = (data) => {
    setApiData(data);
  };
  return (
    <div>
      <nav className="menu-nav">
        <h1 className="menu-title">Ventas realizadas</h1>{" "}
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <div style={{ marginBottom: "100px" }}>
        <div className="ventas-container">
          {ventas.map((venta, index) => (
            <div key={index} className="venta-item">
              <h3>{format(new Date(venta.createdAt), "dd/MM/yyyy - HH:mm")}</h3>
              <ul>
                {venta.productos.map((producto, pIndex) => (
                  <div className="producto-content" key={pIndex}>
                    <div className="producto-info">
                      <div className="producto-detail">
                        <div>Producto: {producto.nombre}</div>
                      </div>
                      <div className="producto-detail">
                        <p>Cantidad: {producto.cantidad}</p>
                      </div>
                      <div className="producto-detail">
                        <p>Total: {producto.cantidad * producto.precioVenta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
              <p className="precio-total">
                Precio Total de la Venta: {venta.preciototal}
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

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

function SearchStock() {
  const { getStocks, stocks } = useStock();
  const [apiData, setApiData] = useState(null);

  const navigate = useNavigate();

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
        <h1>Lista de Productos</h1>
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
      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default SearchStock;

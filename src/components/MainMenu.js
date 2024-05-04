import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOut,
  faAdd,
  faRectangleList,
  faCartArrowDown,
  faSheetPlastic,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../VoiceRecognition/audiocapture.js";
import "./MainMenu.css";
import { Link, useNavigate } from "react-router-dom";
import AddBodegaPage from "./Bodega/addbodega.js";
import { useBodega } from "./context/BodegaContext.js";
import { useAuth } from "./context/AuthContext.js";
import Cookies from "js-cookie";
import { useStock } from "./context/AddContext.js";

function MainMenu() {
  const [ApiData, setApiData] = useState(null);
  const [modal, setModal] = useState(false);
  const [info, setinfo] = useState(false);

  const navigate = useNavigate();
  const { getBodegas, bodegas, gettokenbodega, calltokenbodega } = useBodega();
  const { getStocks, stocks } = useStock();
  const [CommandNotRecognized, setCommandNotRecognized] = useState(false);

  const fetchStocks = async () => {
    const tokenBodega = Cookies.get("tokenbodega");
    if (tokenBodega) {
      await getStocks();
    }
  };
  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    getBodegas();
  }, []);

  const handleApiResponse = (data) => {
    setApiData(data);
    console.log(ApiData);
    if (Cookies.get("tokenbodega")) {
      const { transcription } = data;
      if (transcription) {
        switch (transcription.comando) {
          case "agregar":
            navigate("/agregar");
            break;
          case "buscar":
            navigate("/buscar");
            break;
          case "vender":
            navigate("/venta");
            break;
          case "vendi":
            navigate("/venta");
            break;
          case "ventas":
            navigate("/ventas");
            break;
          case "producto":
            const foundProduct = stocks.find(
              (product) => product.nombre === data.transcription.nombre_producto
            );
            if (foundProduct) {
              const idproducto = foundProduct._id;
              navigate(`/producto/${idproducto}`);
            }
            break;
          case "None":
            setCommandNotRecognized(true);
            break;
        }
      }
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setCommandNotRecognized(false);
    setinfo(false);
  };

  const openInfo = () => {
    setinfo(true);
  };

  const { logout, user } = useAuth();

  const [selectedBodega, setSelectedBodega] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const cookies = Cookies.get();
      if (cookies.tokenbodega) {
        try {
          const bodegadeltoken = await calltokenbodega();

          setSelectedBodega({
            id: bodegadeltoken.data.id,
            nombre: bodegadeltoken.data.nombre,
          });
        } catch (error) {}
      } else {
      }
    };
    fetchData();
  }, [calltokenbodega]);

  const handleSelectChange = async (event) => {
    const selectedId = event.target.value;
    const selectedNombre = bodegas.find(
      (bodega) => bodega._id === selectedId
    ).nombrebodega;
    await gettokenbodega(selectedId);

    try {
      setSelectedBodega({ id: selectedId, nombre: selectedNombre });
      window.location.reload();
      //const res = await calltokenbodega();
      //console.log(res.data);
      //const cookies = Cookies.get();
      //console.log(cookies.tokenbodega);
    } catch (error) {
      //console.error("Error al obtener la información de la bodega:", error);
    }
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Menu Principal</h1>{" "}
        <div className="button-help" onClick={openInfo}>
          AYUDA
        </div>
        <Link to="/" onClick={() => logout()}>
          <div className="menu-button">
            <FontAwesomeIcon icon={faSignOut} />
          </div>
        </Link>
      </nav>
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="texto-grande">Comando no reconocido</div>
            <div>
              El comando que ha dicho no es reconocido. Por favor, intente de
              nuevo. De click en AYUDA si lo necesita.
            </div>
          </div>
        </div>
      )}
      <div className="App">
        {info && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>{" "}
              <div className="texto-grande">
                Los comandos de voz para esta pagina son:
              </div>
              <div className="texto-grande">Agregar</div>
              <div>Ve a la pestaña de agregar producto</div>
              <div className="texto-grande">Buscar:</div>
              <div>Ve a la ventana de lista de productos</div>
              <div className="texto-grande">Producto: "Nombre" </div>
              <div>Ve a la pestaña de detalle de ese producto </div>
              <div className="texto-grande">Vender: </div>
              <div>Ve a la pestaña de ventas de productos</div>
              <div className="texto-grande">Ventas: </div>
              <div>Ve a la pestaña de detalle de ventas</div>
            </div>
          </div>
        )}
      </div>
      <div className="text-style">Bienvenido {user.username}</div>
      <div className="App">
        {modal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <AddBodegaPage closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {bodegas.length === 0 ? (
          <div className="">CREE UNA BODEGA</div>
        ) : (
          <select
            value={selectedBodega.id}
            onChange={handleSelectChange}
            className="select"
          >
            {!Cookies.get("tokenbodega") && (
              <option value="">Selecciona una bodega</option>
            )}

            {bodegas.length === 0 && (
              <option value disabled="">
                Cree una bodega
              </option>
            )}

            {bodegas.map((bodega) => (
              <option key={bodega._id} value={bodega._id}>
                {bodega.nombrebodega}
              </option>
            ))}
          </select>
        )}

        <button className="button_add" onClick={openModal}>
          <FontAwesomeIcon className="icon" icon={faAdd} />
        </button>
        {bodegas.length === 0 || !Cookies.get("tokenbodega") ? (
          <div className=""></div>
        ) : (
          <Link to="/editBodega">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        )}
      </div>
      <div className="icon-container">
        <div className="icon-row">
          {Cookies.get("tokenbodega") && (
            <Link to="/agregar">
              <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                  icon={faAdd}
                  size="5x"
                  color="blue"
                  style={{ marginBottom: "10px", marginRight: "30px" }}
                />
                <div style={{ marginBottom: "10px", marginRight: "30px" }}>
                  Agregar Producto
                </div>
              </div>
            </Link>
          )}
          {Cookies.get("tokenbodega") && (
            <Link to="/buscar">
              <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                  icon={faRectangleList}
                  size="5x"
                  color="blue"
                  style={{ marginBottom: "10px", marginLeft: "30px" }}
                />
                <div style={{ marginBottom: "10px", marginLeft: "30px" }}>
                  List de Productos
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="icon-row">
          {Cookies.get("tokenbodega") && (
            <Link to="/venta">
              <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                  icon={faCartArrowDown}
                  size="4x"
                  color="blue"
                  style={{ marginBottom: "10px", marginRight: "30px" }}
                />
                <div style={{ marginBottom: "10px", marginRight: "30px" }}>
                  Venta de Producto
                </div>
              </div>
            </Link>
          )}
          {Cookies.get("tokenbodega") && (
            <Link to="/ventas">
              <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                  icon={faSheetPlastic}
                  size="4x"
                  color="blue"
                  style={{ marginBottom: "10px", marginLeft: "30px" }}
                />
                <div style={{ marginBottom: "10px", marginLeft: "30px" }}>
                  Informe de ventas
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {CommandNotRecognized && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="texto-grande">Comando no reconocido</div>
            <div>
              El comando que ha dicho no es reconocido. Por favor, inténtelo de
              nuevo. Haga clic en AYUDA si necesita asistencia.
            </div>
          </div>
        </div>
      )}

      <div className="audio-recorder">
        <AudioRecorder onApiResponse={handleApiResponse} />
      </div>
    </div>
  );
}

export default MainMenu;

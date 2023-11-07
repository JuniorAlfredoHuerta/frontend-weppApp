import { useForm } from "react-hook-form";
import { useBodega } from "../../context/BodegaContext";
import { useEffect, useState } from "react";
import "./editbodega.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";

function EditPage() {
  const { register, handleSubmit } = useForm();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { getBodegas, calltokenbodega, bodegas, updateBodega } = useBodega();
  const [bodegadata, setBodega] = useState({});

  useEffect(() => {
    getBodegas(bodegas);
    if (bodegas.length > 0) {
      setBodega(bodegas[0]);
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const { nombre, ...restoData } = data;
    await updateBodega(bodegadata._id, restoData);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBodega({
      ...bodegadata,
      [name]: value,
    });
  };
  const closeMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Editar Bodega</h1>{" "}
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      {bodegas.length > 0 && ( // Aquí se verifica si hay bodegas en el estado
        <form onSubmit={onSubmit} className="form-css">
          <h3>Actualiza los datos de la bodega</h3>
          <label>Nombre de la bodega</label>
          <input
            type="text"
            {...register("nombrebodega", { required: true })}
            value={bodegadata.nombrebodega || ""}
            className="registro-inputs"
            onChange={handleChange}
          />
          <label>Documento de la bodega</label>
          <input
            type="text"
            {...register("idDoc", { required: true })}
            value={bodegadata.idDoc || ""}
            className="registro-inputs"
            onChange={handleChange}
          />{" "}
          <label>Razon Social</label>
          <input
            type="text"
            {...register("razonsocial", { required: true })}
            value={bodegadata.razonsocial || ""}
            className="registro-inputs"
            onChange={handleChange}
          />
          <label>Ubicacion de la bodega</label>
          <input
            type="text"
            {...register("ubicacion", { required: true })}
            value={bodegadata.ubicacion || ""}
            className="registro-inputs"
            onChange={handleChange}
          />
          <div className="audio-recorder">
            <AudioRecorder />
          </div>
          <button type="submit">Guardar cambios</button>
        </form>
      )}
      {showSuccessMessage && (
        <div className="success-message">
          <span className="close" onClick={closeMessage}>
            &times;
          </span>
          <p>La bodega fue actualizada correctamente.</p>
        </div>
      )}
      <div className="audio-recorder">
        <AudioRecorder />
      </div>
    </div>
  );
}

export default EditPage;

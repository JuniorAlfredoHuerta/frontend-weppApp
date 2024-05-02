import { useForm } from "react-hook-form";
import { useBodega } from "../../context/BodegaContext";
import { useEffect, useState } from "react";
import "./editbodega.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import AudioRecorder from "../../../VoiceRecognition/audiocapture";
import Cookies from "js-cookie";

function EditPage() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { calltokenbodega, updateBodega, getBodega, deleteBodega } =
    useBodega();
  const [bodegadata, setBodegaData] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await calltokenbodega();
      const databodega = await getBodega(res.data.id);
      if (res && res.data) {
        // Llenar los valores del formulario con setValue
        setValue("nombrebodega", databodega.nombrebodega);
        setValue("idDoc", databodega.idDoc);
        setValue("razonsocial", databodega.razonsocial);
        setValue("ubicacion", databodega.ubicacion);
      }
    };

    fetchData();
  }, [calltokenbodega, getBodega, setValue]);

  const onSubmit = async (data) => {
    // Validar campos requeridos
    const requiredFields = [
      "nombrebodega",
      "idDoc",
      "razonsocial",
      "ubicacion",
    ];
    const errors = {};
    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors[field] = "Campo requerido";
      }
    });
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const res = await calltokenbodega();
        const databodega = await getBodega(res.data.id);
        await updateBodega(databodega._id, data);
        setShowSuccessMessage(true);
      } catch (error) {
        console.error("Error updating bodega:", error);
      }
    }
  };

  const closeMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    const res = await calltokenbodega();
    const databodega = await getBodega(res.data.id);
    await deleteBodega(databodega._id);
    setShowConfirmation(false);
    Cookies.remove("tokenbodega");
    navigate("/mainmenu");
    alert("Bodega eliminada correctamente");
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
      <div className="button-container">
        <div> </div>
        <button className="delete-button" onClick={handleDeleteConfirmation}>
          <FontAwesomeIcon icon={faTrash} />
          Eliminar
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-css">
        <h3>Actualiza los datos de la bodega</h3>
        <label>Nombre de la bodega</label>
        <input
          type="text"
          {...register("nombrebodega")}
          defaultValue={bodegadata.nombrebodega || ""}
          className="registro-inputs"
        />
        {errors.nombrebodega && (
          <p className="error-message">Campo requerido</p>
        )}
        {formErrors.nombrebodega && (
          <p className="error-message">{formErrors.nombrebodega}</p>
        )}

        <label>Documento de la bodega</label>
        <input
          type="text"
          {...register("idDoc")}
          defaultValue={bodegadata.idDoc || ""}
          className="registro-inputs"
        />
        {errors.idDoc && <p className="error-message">Campo requerido</p>}
        {formErrors.idDoc && (
          <p className="error-message">{formErrors.idDoc}</p>
        )}

        <label>Razon Social</label>
        <input
          type="text"
          {...register("razonsocial")}
          defaultValue={bodegadata.razonsocial || ""}
          className="registro-inputs"
        />
        {errors.razonsocial && <p className="error-message">Campo requerido</p>}
        {formErrors.razonsocial && (
          <p className="error-message">{formErrors.razonsocial}</p>
        )}

        <label>Direccion de la bodega</label>
        <input
          type="text"
          {...register("ubicacion")}
          defaultValue={bodegadata.ubicacion || ""}
          className="registro-inputs"
        />
        {errors.ubicacion && <p className="error-message">Campo requerido</p>}
        {formErrors.ubicacion && (
          <p className="error-message">{formErrors.ubicacion}</p>
        )}
        <div className="audio-recorder">
          <AudioRecorder />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
      {showSuccessMessage && (
        <div className="success-message">
          <span className="close" onClick={closeMessage}>
            &times;
          </span>
          <p>La bodega fue actualizada correctamente.</p>
        </div>
      )}
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <div className="confirmation-modal">
              <p>¿Estás seguro de que quieres eliminar esta bodega?</p>
              <div className="button-container">
                <button onClick={handleConfirmDelete}>Sí, Eliminar</button>
                <button onClick={() => setShowConfirmation(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="audio-recorder">
        <AudioRecorder />
      </div>
    </div>
  );
}

export default EditPage;

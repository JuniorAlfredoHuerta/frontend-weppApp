import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import AudioRecorder from "../../VoiceRecognition/audiocapture";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Edituser() {
  const { user, updateUser, checkLogin } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Llena los campos del formulario con los datos del usuario al cargar el componente
    if (user) {
      setValue("username", user.username || "");
      setValue("name", user.name || "");
      setValue("idDoc", user.idDoc || "");

      // Formatea la fecha de nacimiento para el input tipo 'date'
      const formattedDate = user.birthdate
        ? user.birthdate.substring(0, 10)
        : "";
      setValue("birthdate", formattedDate);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      // Enviar la fecha en formato ISO (AAAA-MM-DD) al backend
      data.birthdate = data.birthdate + "T00:00:00.000Z"; // Agrega la hora para el formato ISO
      await updateUser(user.id, data); // Actualiza el usuario con los datos del formulario
      setShowSuccessMessage(true);
      checkLogin();
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <h1 className="menu-title">Editar Usuario</h1>{" "}
        <Link to="/mainmenu">
          <div className="menu-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
      </nav>
      <form onSubmit={handleSubmit(onSubmit)} className="form-css">
        <h3>Actualiza los datos del usuario</h3>
        <label>Nombre de la cuenta</label>
        <input
          type="text"
          {...register("username", { required: true })}
          className="registro-inputs"
        />
        {errors.username && <p className="redto">Campo requerido</p>}

        <label>Nombre real del usuario</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="registro-inputs"
        />
        {errors.name && <p className="redto">Campo requerido</p>}

        <label>Documento</label>
        <input
          type="text"
          {...register("idDoc", { required: true })}
          className="registro-inputs"
        />
        {errors.idDoc && <p className="redto">Campo requerido</p>}

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          {...register("birthdate", { required: true })}
          className="registro-inputs"
        />
        {errors.birthdate && <p className="redto">Campo requerido</p>}

        <div className="audio-recorder">
          <AudioRecorder />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>

      {showSuccessMessage && (
        <div className="success-message">
          <span className="close" onClick={() => setShowSuccessMessage(false)}>
            &times;
          </span>
          <p>El usuario fue actualizado correctamente.</p>
        </div>
      )}
    </div>
  );
}

export default Edituser;

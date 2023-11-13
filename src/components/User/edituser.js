import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import AudioRecorder from "../../VoiceRecognition/audiocapture";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Edituser() {
  const { user, updateUser, checkLogin } = useAuth();
  const { register, handleSubmit } = useForm();
  const [userdata, setUser] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setUser(user);
    console.log(user);
    formatUserForForm(user);
  }, []);

  const formatUserForForm = (user) => {
    if (user && user.birthdate) {
      const formattedDate = user.birthdate.substring(0, 10); // Extrae la parte de la fecha necesaria (AAAA-MM-DD)
      setUser({ ...user, birthdate: formattedDate }); // Actualiza la fecha en el estado para que sea compatible con el campo de entrada de fecha
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...userdata,
      [name]: value,
    });
  };

  const closeMessage = () => {
    setShowSuccessMessage(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    const { password, ...restoData } = data;
    console.log(user.id);
    await updateUser(user.id, restoData);
    setShowSuccessMessage(true);
    checkLogin();
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  });
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
      <form onSubmit={onSubmit} className="form-css">
        <h3>Actualiza los datos del usuario</h3>
        <label>Nombre de la cuenta</label>
        <input
          type="text"
          {...register("username", { required: true })}
          value={userdata.username || ""}
          className="registro-inputs"
          onChange={handleChange}
        />
        <label>Nombre real del usuario</label>
        <input
          type="text"
          {...register("name", { required: true })}
          value={userdata.name || ""}
          className="registro-inputs"
          onChange={handleChange}
        />
        <label>Documento</label>

        <input
          type="text"
          {...register("idDoc", { required: true })}
          value={userdata.idDoc || ""}
          className="registro-inputs"
          onChange={handleChange}
        />
        <label>Fecha de nacimiento</label>
        <input
          type="date"
          {...register("birthdate", { required: true })}
          value={userdata.birthdate || ""}
          className="registro-inputs"
          onChange={handleChange}
        />
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
          <p>El usuario fue actualizado correctamente.</p>
        </div>
      )}
      <div className="audio-recorder">
        <AudioRecorder />
      </div>
    </div>
  );
}
export default Edituser;

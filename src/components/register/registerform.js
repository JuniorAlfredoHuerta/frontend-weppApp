import React, { useEffect, useState } from "react";
import "./register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Registerform() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();

  const { signup, isAuthenticated, errors: authErrors, setErrors } = useAuth();
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(null);

  const onSubmit = handleSubmit(async (values) => {
    try {
      signup(values);
      const audioFile = new File([await fetchAudioFile()], "audio.wav");

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });
      if (isAuthenticated) {
        setErrors([]);
      }
    } catch (error) {
      console.error("Error de conexión:", error.message);
      setConnectionError("No se pudo establecer la conexión con el servidor");
    }
  });

  const fetchAudioFile = async () => {
    const response = await fetch("../audio.wav");
    const blob = await response.blob();
    return blob;
  };

  useEffect(() => {
    if (isAuthenticated) {
      setConnectionError(null);
      navigate("/mainmenu");
      window.location.reload();
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="menu-container">
      {connectionError && <div className="errormessage">{connectionError}</div>}
      {authErrors.length > 0 && (
        <div className="errormessage">
          {authErrors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("username", { required: true })}
          placeholder="Usuario"
          className="registro-inputs"
        />
        {formErrors.username && <p className="redto">Usuario requerido</p>}
        <input
          type="email"
          {...register("correo", { required: true })}
          placeholder="Correo electronico"
          className="registro-inputs"
        />
        {formErrors.correo && <p className="redto">Correo requerido</p>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Contraseña"
          className="registro-inputs"
        />
        {formErrors.password && <p className="redto">Contraseña requerida</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registerform;

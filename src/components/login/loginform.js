import React, { useEffect, useState } from "react";
import "./loginform.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();

  const { signin, isAuthenticated, errors: authErrors, setErrors } = useAuth();

  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signin(data);
      setConnectionError(null);
      //const audioFile = new File([await fetchAudioFile()], "audio.wav");

      //const formData = new FormData();
      //formData.append("audio", audioFile);

      /* //const response = await fetch("https://apimodelo-production.up.railway.app/transcribe", {
      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });*/
      if (isAuthenticated) {
        setErrors([]);
      }
    } catch (error) {
      console.error("Error de conexión:", error.message);
    }
  });

  /*const fetchAudioFile = async () => {
    const response = await fetch("../audio.wav");
    const blob = await response.blob();
    return blob;
  };*/

  useEffect(() => {
    if (isAuthenticated) {
      setConnectionError(null);
      navigate("/mainmenu");
      window.location.reload();
    }
  }, [isAuthenticated, navigate]);

  const handleForgotPassword = () => {
    navigate("/recover");
  };

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
          type="email"
          {...register("correo", { required: true })}
          placeholder="Correo electrónico"
          className="registro-inputs"
        />
        {formErrors.correo && <p className="redto">Correo requerido</p>}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true })}
            placeholder="Contraseña"
            className="registro-inputs"
          />
          <div
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </div>
        </div>
        {formErrors.password && <p className="redto">Contraseña requerida</p>}
        <button
          type="button"
          className="forgot-password-button"
          onClick={handleForgotPassword}
        >
          ¿He olvidado mi contraseña?
        </button>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginForm;

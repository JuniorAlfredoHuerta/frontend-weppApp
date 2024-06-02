import React, { useEffect, useState } from "react";
import "./register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Registerform() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm();

  const { signup, isAuthenticated, errors: authErrors, setErrors } = useAuth();
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState(false);

  const closeInfo = () => {
    if (isAuthenticated) {
      setConnectionError(null);
      navigate("/mainmenu");
      window.location.reload();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (!termsChecked) {
        throw new Error("Debes aceptar los términos y condiciones");
      }

      // Verificar si la contraseña cumple con los requisitos
      if (!validatePassword(values.password)) {
        throw new Error(
          "La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales."
        );
      }

      signup(values);
      //const audioFile = new File([await fetchAudioFile()], "audio.wav");

      //const formData = new FormData();
      //formData.append("audio", audioFile);

      /*const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });*/
      if (isAuthenticated) {
        setErrors([]);
      }
      setInfo(true);
    } catch (error) {
      if (error.message.includes("La contraseña debe contener")) {
        setErrors([
          "La contraseña debe contener al menos 8 caracteres, y por lo menos una mayuscula, un numero y un caracter especial",
        ]);
      } else {
        setErrors(["Error al crear el usuario."]);
      }
    }
  });

  const validatePassword = (password) => {
    // Utiliza una expresión regular para verificar la contraseña
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  /*const fetchAudioFile = async () => {
    const response = await fetch("../audio.wav");
    const blob = await response.blob();
    return blob;
  };*/

  useEffect(() => {}, [isAuthenticated, navigate]);

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
      {info && (
        <div className="modal">
          <div className="modal-content">
            <div className="texto-grande">
              !Su cuenta ha sido creado exitosamente!
            </div>
            <button onClick={closeInfo}>Continuar</button>
          </div>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("username", { required: true })}
          placeholder="Nombre de usuario"
          className="registro-inputs"
        />
        {formErrors.username && <p className="redto">Usuario requerido</p>}
        <input
          type="email"
          {...register("correo", {
            required: true,
            pattern: {
              value: /^[\w-]+(\.[\w-]+)*@([gmail|hotmail]+(\.[a-zA-Z]{2,3})+)$/,
              message: "El correo electrónico debe ser de Gmail o Hotmail",
            },
          })}
          placeholder="Correo electrónico"
          className="registro-inputs"
        />
        {formErrors.correo && (
          <p className="redto">{formErrors.correo.message}</p>
        )}

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
        <div className="terms-checkbox">
          <input
            type="checkbox"
            {...register("terms", { required: true })}
            id="termsCheckbox"
            onChange={() => setTermsChecked(!termsChecked)}
          />
          <label htmlFor="termsCheckbox">
            Acepto los{" "}
            <a
              href="https://drive.google.com/file/d/1ZvwLVVO5N72rCiQkkyVeTZiuZVcwA_nL/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              términos y condiciones
            </a>
          </label>
        </div>

        {formErrors.terms && (
          <p className="redto">Debes aceptar los términos y condiciones</p>
        )}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registerform;

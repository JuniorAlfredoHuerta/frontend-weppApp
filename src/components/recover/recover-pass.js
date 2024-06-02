import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./recover-pass.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Recover() {
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState(false);
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(null);

  const closeInfo = () => {
    setConnectionError(null);
    navigate("/");
  };
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();

  const { errors: authErrors, setErrors, edit } = useAuth();
  const validatePassword = (password) => {
    // Utiliza una expresión regular para verificar la contraseña
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!validatePassword(data.password)) {
        throw new Error(
          "La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales."
        );
      }
      setErrors([]);
      const response = await edit(data);
      if (response) {
        setInfo(true);
      }
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

  useEffect(() => {
    setErrors([]);
  }, [setErrors]);

  const handleClearErrors = () => {
    setErrors([]);
  };
  return (
    <div className="menu-container">
      {info && (
        <div className="modal">
          <div className="modal-content">
            <div className="texto-grande">
              !Su contraseña ha sido creado exitosamente!
            </div>
            <button onClick={closeInfo}>Continuar</button>
          </div>
        </div>
      )}
      <nav className="main-menu">
        <h1> Bienvenido a EasyInventory</h1>
      </nav>
      <div className="container">
        <h2 className="centered-text">Recuperación de contraseña</h2>
        {connectionError && (
          <div className="errormessage">{connectionError}</div>
        )}
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
            {...register("correo", {
              required: true,
              pattern: {
                value:
                  /^[\w-]+(\.[\w-]+)*@([gmail|hotmail]+(\.[a-zA-Z]{2,3})+)$/,
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
          <button type="submit">Enviar</button>
        </form>
      </div>
      <div className="container">
        <p>Regresa al Inicio de sesión </p>
        <Link to="/" onClick={handleClearErrors} className="link-button">
          <button>Inicio</button>
        </Link>
      </div>
    </div>
  );
}

export default Recover;

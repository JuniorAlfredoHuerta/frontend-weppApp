import React from "react";
import { Link } from "react-router-dom";
import "./recoverpage.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";

function Recover() {
  const {
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();

  const { setErrors } = useAuth();

  const onSubmit = handleSubmit(async (data) => {});

  const handleClearErrors = () => {
    setErrors([]);
  };
  return (
    <div className="menu-container">
      <nav className="main-menu">
        <h1> Bienvenido a EasyInventory</h1>
      </nav>
      <div className="container">
        <h2 className="centered-text">Recuperación de contraseña</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="registro-inputs"
          ></input>
        </form>
        <button type="submit" onClick={handleSubmit}>
          Enviar solicitud
        </button>
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

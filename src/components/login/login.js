import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./loginform";
import "./login.css";
import { useAuth } from "../context/AuthContext.js";

function Login() {
  const { setErrors } = useAuth();

  const handleClearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="menu-container">
      <nav className="main-menu">
        <h1>Bienvenido a EasyInventory</h1>
      </nav>
      <div className="container">
        <h2>Inicio de sesión</h2>
        <LoginForm />
      </div>
      <div className="container">
        <p>No tiene cuenta, Registrese de inmediato </p>
        <Link to="/register" onClick={handleClearErrors}>
          <button>Registro</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;

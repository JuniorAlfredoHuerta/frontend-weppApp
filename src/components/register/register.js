import React from "react";
import "./register.css";
import Registerform from "../register/registerform";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
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
        <h2>Registrese</h2>

        <Registerform />
      </div>
      <div className="container">
        <p>Si ya posee una cuenta ingrese </p>
        <Link to="/" onClick={handleClearErrors}>
          <button>Ingreso</button>
        </Link>
      </div>{" "}
    </div>
  );
}

export default Register;

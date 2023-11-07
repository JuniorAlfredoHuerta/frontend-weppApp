import React from "react";
import "./register.css";
import Registerform from "../register/registerform";
import { Link } from "react-router-dom";

function Register() {
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
        <Link to="/">
          <button>Ingreso</button>
        </Link>
      </div>{" "}
    </div>
  );
}

export default Register;

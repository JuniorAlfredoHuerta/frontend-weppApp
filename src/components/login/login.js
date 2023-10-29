import React from "react";
import LoginForm from "./loginform";
import "./login.css";
import Registerform from "../register/registerform";

function Login() {
  return (
    <div className="menu-container">
      <nav className="main-menu">
        <h1>Bienvenido a EasyInventory</h1>
      </nav>
      <div className="container">
        <h2>Si ya tiene cuenta inicie sesion</h2>
        <LoginForm />
      </div>
      <div className="container">
        <h2>Registrese</h2>

        <Registerform />
      </div>
    </div>
  );
}

export default Login;

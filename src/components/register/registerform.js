import React, { useEffect, useState } from "react";
import "./register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Registerform() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: Autherrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/mainmenu");
    }
  }, [isAuthenticated]);

  return (
    <div className="menu-container">
      {Autherrors.map((error, i) => (
        <div className="errormessage" key={i}>
          {error}
        </div>
      ))}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("username", { required: true })}
          placeholder="Usuario"
          className="registro-inputs"
        />
        {errors.username && <p className="redto">Usuario requerido</p>}
        <input
          type="email"
          {...register("correo", { required: true })}
          placeholder="Correo electronico"
          className="registro-inputs"
        />
        {errors.correo && <p className="redto">Correo requerido</p>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Contraseña"
          className="registro-inputs"
        />
        {errors.password && <p className="redto">Contraseña requerida</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registerform;

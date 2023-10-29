import React, { useEffect, useState } from "react";
import "./loginform.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, isAuthenticated, errors: Autherrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    signin(data);
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
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginForm;

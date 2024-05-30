import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import "./addbodega.css";
import { useBodega } from "../context/BodegaContext";

function AddBodegaPage({ closeModal }) {
  const [submitting, setSubmitting] = useState(false);
  const [ERRORES, setErros] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createBodega, getBodegas, bodegas, allbodegas, AllBodegas } =
    useBodega();

  useEffect(() => {
    setErros([]); // Limpiar los errores al montar el componente
  }, []);

  const onSubmit = async (data) => {
    try {
      if (!/^(?=.*[A-Za-z])[A-Za-z0-9]+$/.test(data.nombrebodega)) {
        throw new Error(
          "El nombre de la bodega debe contener al menos una letra."
        );
      }
      if (!/^\d+$/.test(data.idDoc)) {
        throw new Error("El RUC de la bodega debe contener solo números.");
      }
      if (!/^(?=.*[A-Za-z])[A-Za-z0-9]+$/.test(data.razonsocial)) {
        throw new Error("La razón social debe contener al menos una letra.");
      }
      if (!/^(?=.*[A-Za-z])[A-Za-z0-9]+$/.test(data.ubicacion)) {
        throw new Error(
          "La ubicación de la bodega debe contener al menos una letra."
        );
      }
      if (!(data.idDoc.length === 8 || data.idDoc.length === 11)) {
        throw new Error("El campo Documento debe tener ser un numero valido.");
      }
      const existingBodega = bodegas.find(
        (bodega) => bodega.nombrebodega === data.nombrebodega
      );

      const existeruc = allbodegas.find(
        (bodega) => bodega.idDoc === data.idDoc
      );
      const existerazon = allbodegas.find(
        (bodega) => bodega.razonsocial === data.razonsocial
      );

      if (existingBodega) {
        throw new Error("Ya existe una bodega con ese nombre.");
      }
      if (existeruc) {
        throw new Error("Ya existe una bodega con ese ruc.");
      }
      if (existerazon) {
        throw new Error("Ya existe una bodega con esa razón social.");
      }
      await AllBodegas();
      await createBodega(data);
      await getBodegas();
      closeModal();
      setErros([]);
    } catch (error) {
      console.error("Error al crear la bodega:", error);
      setErros([error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {ERRORES.map((error, i) => (
        <div className="errormessage" key={i}>
          {error}
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("nombrebodega", { required: true })}
          placeholder="Nombre de la bodega"
          className="registro-inputs"
        />
        {errors.nombrebodega && <p className="redto">Campo requerido</p>}

        <input
          type="text"
          {...register("idDoc", { required: true })}
          placeholder="Documento(DNI o RUC)"
          className="registro-inputs"
        />
        {/* Mostrar un mensaje de error específico para la longitud incorrecta de idDoc */}
        {errors.idDoc && errors.idDoc.type === "required" && (
          <p className="redto">Campo requerido</p>
        )}

        <input
          type="text"
          {...register("razonsocial", { required: true })}
          placeholder="Razon social"
          className="registro-inputs"
        />
        {errors.razonsocial && <p className="redto">Campo requerido</p>}

        <input
          type="text"
          {...register("ubicacion", { required: true })}
          placeholder="Ubicación de la bodega"
          className="registro-inputs"
        />
        {errors.ubicacion && <p className="redto">Campo requerido</p>}

        <button type="submit">Registrar Bodega</button>
      </form>
    </div>
  );
}

export default AddBodegaPage;

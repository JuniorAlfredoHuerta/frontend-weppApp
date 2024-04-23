import { useForm } from "react-hook-form";
import { useEffect } from "react";

import "./addbodega.css";
import { useBodega } from "../context/BodegaContext";

function AddBodegaPage({ closeModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createBodega, getBodegas, errors: ERRORES, setErros } = useBodega();
  useEffect(() => {
    // Limpia los errores al montar el componente
    setErros([]);
  }, [setErros]);
  const onSubmit = async (data) => {
    try {
      // Validar que idDoc tenga exactamente 11 dígitos
      if (data.idDoc.length !== 11) {
        throw new Error(
          "El campo Documento de la bodega debe tener 11 dígitos."
        );
      }

      await createBodega(data); // Esperar a que se complete la creación de la bodega
      await getBodegas(); // Actualizar la lista de bodegas después de crear una nueva

      // Si no hay errores durante la creación y actualización, cerrar el modal
      closeModal();
    } catch (error) {
      console.error("Error al crear la bodega:", error);
      // Mostrar un mensaje de error específico para la longitud incorrecta de idDoc
      if (
        error.message.includes("Documento de la bodega debe tener 11 dígitos")
      ) {
        // Actualizar el estado de errores para mostrar el mensaje
        ERRORES.push("El Documento de la bodega debe tener 11 dígitos.");
      } else {
        // Manejar otros errores según sea necesario
        ERRORES.push("Error al crear la bodega.");
      }
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
          placeholder="Documento de la bodega"
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

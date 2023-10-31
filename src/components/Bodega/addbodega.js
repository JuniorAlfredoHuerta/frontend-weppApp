import { useForm } from "react-hook-form";
import "./addbodega.css";
import { useBodega } from "../context/BodegaContext";

function AddBodegaPage({ closeModal }) {
  const { register, handleSubmit } = useForm();
  const { createBodega, getBodegas } = useBodega();

  const onSubmit = handleSubmit(async (data) => {
    createBodega(data);
    getBodegas();
    closeModal();
  });
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("nombrebodega", { required: true })}
          placeholder=" Nombre de la bodega"
          className="registro-inputs"
        ></input>
        <input
          type="text"
          {...register("idDoc", { required: true })}
          placeholder=" Documento de la bodega"
          className="registro-inputs"
        ></input>
        <input
          type="text"
          {...register("razonsocial", { required: true })}
          placeholder=" Razon social"
          className="registro-inputs"
        ></input>
        <input
          type="text"
          {...register("ubicacion", { required: true })}
          placeholder=" Ubicación de la bodega"
          className="registro-inputs"
        ></input>

        <button type="submit">Registrar Bodega</button>
      </form>
    </div>
  );
}

export default AddBodegaPage;

import { useForm } from "react-hook-form";
import { useStock } from "../context/AddContext";

function Agregarstock() {
  const { register, handleSubmit } = useForm();
  const stocks = useStock();
  return <div>a</div>;
}

export default Agregarstock;

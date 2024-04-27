import { useEffect, useState } from "react";
import { useStock } from "../../context/AddContext";
import { parse, set } from "date-fns";

function SelectProducto({ onProductoChange, apiData }) {
  const { stocks, getStocks, getStock } = useStock();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [precioVenta, setPrecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [nombre, setNombre] = useState("");

  const [total, setTotal] = useState("");
  const [cantidadstock, setCantidadstock] = useState("");

  useEffect(() => {
    getStocks();
  }, []);

  const stocksConCantidad = stocks.filter((stock) => stock.cantidad > 0);

  useEffect(() => {
    if (selectedProduct !== null && !apiData) {
      const product = stocksConCantidad.find(
        (product) => product._id === selectedProduct
      );
      setCantidadstock(parseInt(product.cantidad));
      setNombre(product.nombre);
      if (product && precioVenta == "") {
        setPrecioVenta(product.precioventa || "");
      }
    }
  }, [selectedProduct, stocksConCantidad]);

  useEffect(() => {
    if (!apiData) {
      if (cantidad !== "" && parseInt(cantidad) > cantidadstock) {
        setCantidad(cantidadstock);
      }
      if (precioVenta !== "" && cantidad !== "") {
        const calculatedTotal = parseInt(cantidad) * parseFloat(precioVenta);
        setTotal(isNaN(calculatedTotal) ? "" : calculatedTotal);
        onProductoChange({
          _id: selectedProduct,
          nombre: nombre,
          cantidad: parseInt(cantidad),
          precioVenta: precioVenta,
          total: calculatedTotal,
        });
      } else {
        setTotal("");
      }
    }
  }, [precioVenta, cantidad]);

  useEffect(() => {
    if (apiData) {
      const product = stocksConCantidad.find(
        (product) => product.nombre === apiData.transcription.nombre_producto
      );

      setSelectedProduct(product._id);
      //console.log(apiData.transcription.cantidad);
      //console.log(apiData.transcription.precio);
      setCantidad(parseInt(apiData.transcription.cantidad));
      setPrecioVenta(parseFloat(apiData.transcription.precio));
      const totalapi =
        parseFloat(apiData.transcription.cantidad) *
        parseFloat(apiData.transcription.precio);
      //console.log(totalapi);
      setTotal(totalapi);
      setNombre(apiData.transcription.nombre_producto);

      //console.log(selectedProduct);
    }
  }, []);

  const handleProductChange = (e) => {
    if (!apiData) {
      const product = stocksConCantidad.find(
        (product) => product._id === e.target.value
      );
      if (product) {
        setPrecioVenta(product.precioventa || "");
      }
      setSelectedProduct(e.target.value);
    }
  };

  //console.log(" Cantidad", cantidad);
  //console.log("precio", precioVenta);
  //console.log("total", total);
  return (
    <div
      style={{
        display: "flex",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        margin: 10,
      }}
    >
      <select
        style={{ marginRight: "10px" }}
        value={selectedProduct}
        onChange={handleProductChange}
      >
        <option value="">Seleccione un producto</option>
        {stocksConCantidad.map((product, index) => (
          <option key={index} value={product._id}>
            {product.nombre}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Cantidad"
        style={{ marginRight: "10px" }}
        value={
          cantidad ||
          (apiData &&
            apiData.transcription &&
            apiData.transcription.cantidad) ||
          ""
        }
        onChange={(e) => setCantidad(e.target.value)}
      />
      <input
        type="text"
        placeholder="Precio"
        style={{ marginRight: "10px" }}
        value={
          precioVenta ||
          (apiData && apiData.transcription && apiData.transcription.precio) ||
          ""
        }
        onChange={(e) => setPrecioVenta(e.target.value)}
      />
      <input type="text" placeholder="Total" readOnly value={total} />
    </div>
  );
}

export default SelectProducto;

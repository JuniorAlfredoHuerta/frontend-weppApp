import { useEffect, useState } from "react";
import { useStock } from "../../context/AddContext";

function SelectProducto({ onProductoChange }) {
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
    if (selectedProduct !== null) {
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
  }, [precioVenta, cantidad]);

  const handleProductChange = (e) => {
    const product = stocksConCantidad.find(
      (product) => product._id === e.target.value
    );
    if (product) {
      setPrecioVenta(product.precioventa || "");
    }
    setSelectedProduct(e.target.value);
  };

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
        type="number"
        placeholder="Cantidad"
        style={{ marginRight: "10px" }}
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        style={{ marginRight: "10px" }}
        value={precioVenta}
        onChange={(e) => setPrecioVenta(e.target.value)}
      />
      <input type="text" placeholder="Total" readOnly value={total} />
    </div>
  );
}

export default SelectProducto;

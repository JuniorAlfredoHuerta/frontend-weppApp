import { useEffect, useState } from "react";
import { useStock } from "../../context/AddContext";
import { parse, set } from "date-fns";

function SelectProducto({ onProductoChange, apiData }) {
  const { stocks, getStocks, getStock } = useStock();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidadStock, setCantidadStock] = useState(0);
  const [isApiDataInitialized, setIsApiDataInitialized] = useState(false);

  const [total, setTotal] = useState("");

  useEffect(() => {
    getStocks();
  }, []);

  const stocksConCantidad = stocks.filter((stock) => stock.cantidad > 0);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (selectedProduct !== "" && !apiData && !isInitialized) {
      const product = stocksConCantidad.find(
        (product) => product._id === selectedProduct
      );

      if (product) {
        setCantidadStock(parseInt(product.cantidad));
        setNombre(product.nombre);

        if (precioVenta === "") {
          setPrecioVenta(product.precioventa || "");
        }

        setIsInitialized(true); // Set the flag to true after initialization
      }
    }
  }, [selectedProduct, stocksConCantidad, apiData, precioVenta, isInitialized]);

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

  useEffect(() => {
    if (apiData && !isApiDataInitialized) {
      const product = stocksConCantidad.find(
        (product) => product.nombre === apiData.transcription.nombre_producto
      );

      if (product) {
        setSelectedProduct(product._id);
        setCantidad(parseInt(apiData.transcription.cantidad));
        setPrecioVenta(parseFloat(apiData.transcription.precio));
        const totalapi =
          parseFloat(apiData.transcription.cantidad) *
          parseFloat(apiData.transcription.precio);
        setTotal(totalapi);
        setNombre(apiData.transcription.nombre_producto);
        setIsApiDataInitialized(true); // Set the flag to true after initialization
      }
    }
  }, [apiData, stocksConCantidad, isApiDataInitialized]);

  useEffect(() => {
    onProductoChange({
      _id: selectedProduct,
      nombre: nombre,
      cantidad: parseInt(cantidad),
      precioVenta: precioVenta,
      total: total,
    });
  }, [precioVenta, cantidad, total]);

  const handleCantidadChange = (value) => {
    setCantidad(value);
    // Update total if needed
    setTotal(value * precioVenta);
  };

  const handlePrecioVentaChange = (value) => {
    setPrecioVenta(value);
    // Update total if needed
    setTotal(cantidad * value);
  };

  const handleNombreChange = (value) => {
    setNombre(value);
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
        onChange={(e) => handleCantidadChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        style={{ marginRight: "10px" }}
        value={precioVenta}
        onChange={(e) => handlePrecioVentaChange(e.target.value)}
      />
      <input type="text" placeholder="Total" readOnly value={total} />
    </div>
  );
}

export default SelectProducto;

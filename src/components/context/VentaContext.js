import { createContext, useContext, useState } from "react";
import { createVentaRequest, getVentasRequest } from "../../api/venta";

const ventaContext = createContext();

export const useVenta = () => {
  const context = useContext(ventaContext);
  if (!context) {
    throw new Error("use Venta must be used within and ventaprovider");
  }
  return context;
};

export const VentaProvider = ({ children }) => {
  const [ventas, setVentas] = useState([]);

  const createVenta = async (venta) => {
    //console.log(venta);
    await createVentaRequest(venta);
  };

  const getVentas = async () => {
    try {
      const res = await getVentasRequest();
      setVentas(res.data);
    } catch (err) {
      //console.log(err);
    }
  };
  return (
    <ventaContext.Provider value={{ ventas, createVenta, getVentas }}>
      {children}
    </ventaContext.Provider>
  );
};

import { useContext, createContext, useState } from "react";
import { createBodegaRequest, getBodegasRequest } from "../../api/bodega";
const bodegaContext = createContext();

export const useBodega = () => {
  const context = useContext(bodegaContext);
  if (!context) {
    throw new Error("useBodega must be used within a bodegaProvider");
  }
  return context;
};

export const BodegaProvider = ({ children }) => {
  const [bodegas, setBodegas] = useState([]);

  const getBodegas = async () => {
    try {
      const res = await getBodegasRequest();
      console.log(res);
      setBodegas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createBodega = async (bodega) => {
    console.log(bodega);
    const res = await createBodegaRequest(bodega);
    console.log(res);
  };
  return (
    <bodegaContext.Provider value={{ bodegas, createBodega, getBodegas }}>
      {children}
    </bodegaContext.Provider>
  );
};

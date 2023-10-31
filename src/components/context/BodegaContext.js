import { useContext, createContext, useState } from "react";
import {
  createBodegaRequest,
  getBodegasRequest,
  tokenBodega,
  verifytokenBodega,
} from "../../api/bodega";
import Cookies from "js-cookie";

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
  const [bodega, setBodega] = useState(null);

  const getBodegas = async () => {
    try {
      const res = await getBodegasRequest();
      //console.log(res.data);
      setBodegas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const gettokenbodega = async (id) => {
    try {
      //console.log(id);
      const res = await tokenBodega({ bodega: id });
      //console.log(res.data);
    } catch (err) {
      //console.log(err);
    }
  };

  const calltokenbodega = async () => {
    try {
      const cookies = Cookies.get();
      //console.log(cookies.tokenbodega);
      const idbodega = await verifytokenBodega(cookies.tokenbodega);
      //console.log(idbodega);
      return idbodega;
    } catch (err) {}
  };

  const createBodega = async (bodega) => {
    console.log(bodega);
    const res = await createBodegaRequest(bodega);
    console.log(res);
  };
  return (
    <bodegaContext.Provider
      value={{
        bodegas,
        createBodega,
        getBodegas,
        gettokenbodega,
        calltokenbodega,
      }}
    >
      {children}
    </bodegaContext.Provider>
  );
};

import { useContext, createContext, useState } from "react";
import {
  createBodegaRequest,
  deleteBodegaRequest,
  editBodegaRequest,
  getBodegaRequest,
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
  const [errors, setErros] = useState([]);

  const getBodega = async (id) => {
    try {
      const res = await getBodegaRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

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

  const updateBodega = async (id, bodega) => {
    try {
      //console.log(id, stock);
      await editBodegaRequest(id, bodega);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBodega = async (id, bodega) => {
    try {
      //console.log(id, stock);
      await deleteBodegaRequest(id, bodega);
    } catch (error) {
      console.error(error);
    }
  };

  const createBodega = async (bodega) => {
    try {
      console.log(bodega);
      const res = await createBodegaRequest(bodega);
    } catch (error) {
      console.error(error);
      setErros(error.response.data);
    }
  };

  return (
    <bodegaContext.Provider
      value={{
        bodegas,
        createBodega,
        getBodegas,
        gettokenbodega,
        calltokenbodega,
        updateBodega,
        getBodega,
        deleteBodega,
        errors,
        setErros,
      }}
    >
      {children}
    </bodegaContext.Provider>
  );
};

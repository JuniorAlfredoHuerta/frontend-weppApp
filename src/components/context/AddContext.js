import { createContext, useContext, useState } from "react";
import {
  createstockRequest,
  getStockRequest,
  updateStockRequest,
  getStocksRequest,
} from "../../api/stock";

const stockContext = createContext();

export const useStock = () => {
  const context = useContext(stockContext);

  if (!context) {
    throw new Error("useStock must be used within and StockProvider");
  }
  return context;
};

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);

  const getStocks = async () => {
    try {
      const res = await getStocksRequest();
      setStocks(res.data);
    } catch (err) {
      console.log(stocks);
    }
  };

  const getStock = async (id) => {
    try {
      const res = await getStockRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createStock = async (stock) => {
    // console.log(stock);
    const res = await createstockRequest(stock);
    console.log(res);
  };
  const updateStock = async (id, stock) => {
    try {
      console.log(id, stock);
      await updateStockRequest(id, stock);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <stockContext.Provider
      value={{ stocks, createStock, updateStock, getStocks, getStock }}
    >
      {children}
    </stockContext.Provider>
  );
};

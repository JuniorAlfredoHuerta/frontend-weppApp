import { createContext, useContext, useState } from "react";

const stockContext = createContext();

export const useStock = () => {
  const context = useContext(stockContext);

  if (!context) {
    throw new Error("useStock must be used within and StockProvider");
  }
  return context;
};

export const StockProvider = ({ children }) => {
  const [stocks, SetStock] = useState([]);

  const createStock = async (stock) => {
    console.log(stock);
  };
  return (
    <stockContext.Provider value={{ stocks, createStock }}>
      {children}
    </stockContext.Provider>
  );
};

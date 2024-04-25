import axios from "./axios";

export const createstockRequest = (stock) => axios.post("/stock", stock);

export const updateStockRequest = (id, stock) =>
  axios.put(`/stock/${id}`, stock);

  export const deleteStockRequest = (id, stock) =>
  axios.put(`/stockde/${id}`, stock);

export const getStocksRequest = async () => axios.get("/stocks");

export const getStockRequest = async (id) => axios.get(`/stock/${id}`);

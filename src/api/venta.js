import axios from "./axios";

export const createVentaRequest = (venta) => axios.post("/venta", venta);

export const getVentasRequest = async () => axios.get("/venta");

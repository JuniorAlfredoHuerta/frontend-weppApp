import axios from "./axios";

export const tokenBodega = async (bodega) => axios.post("/bodegatoken", bodega);
export const verifytokenBodega = async () => axios.get("/bodegatoken");

export const createBodegaRequest = async (bodega) =>
  axios.post("/bodegas", bodega);

export const editBodegaRequest = async (id, bodega) =>
  axios.put(`/bodegas/${id}`, bodega);

export const deleteBodegaRequest = async (id) => axios.put(`/bodegasde/${id}`);
export const getBodegaRequest = async (id) => axios.get(`/bodegas/${id}`);
export const getBodegasRequest = async () => axios.get("/bodegas");

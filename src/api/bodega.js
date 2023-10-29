import axios from "./axios";

export const createBodegaRequest = async (bodega) =>
  axios.post("/bodegas", bodega);

export const editBodegaRequest = async (bodega) =>
  axios.put(`/bodegas/${bodega._id}`, bodega);

export const deleteBodegaRequest = async (id) => axios.delete(`/bodegas/${id}`);
export const getBodegaRequest = async (id) => axios.get(`/bodegas/${id}`);
export const getBodegasRequest = async () => axios.get("/bodegas");

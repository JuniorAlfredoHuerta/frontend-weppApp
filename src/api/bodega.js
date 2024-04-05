import axios from "./axios";



export const tokenBodega = async (bodega) => {
 try {
    const response = await axios.post("/bodegatoken", bodega);
    return response.data;
 } catch (error) {
    console.error("Error al obtener el token de bodega:", error);
    throw error; // Re-lanza el error para que pueda ser manejado por el llamador
 }
};



export const verifytokenBodega = async () => {
  try {
     const response = await axios.get("/bodegatoken");
     return response.data;
  } catch (error) {
     console.error("Error al verificar el token de bodega:", error);
     throw error;
  }
 };

 

 export const createBodegaRequest = async (bodega) => {
  try {
     const response = await axios.post("/bodegas", bodega);
     return response.data;
  } catch (error) {
     console.error("Error al crear la bodega:", error);
     throw error;
  }
 };
 

 export const editBodegaRequest = async (id, bodega) => {
  try {
     const response = await axios.put(`/bodegas/${id}`, bodega);
     return response.data;
  } catch (error) {
     console.error(`Error al editar la bodega con ID ${id}:`, error);
     throw error;
  }
 };
 

 export const deleteBodegaRequest = async (id) => {
  try {
     const response = await axios.delete(`/bodegas/${id}`);
     return response.data;
  } catch (error) {
     console.error(`Error al eliminar la bodega con ID ${id}:`, error);
     throw error;
  }
 };
 
 
 export const getBodegaRequest = async (id) => {
  try {
     const response = await axios.get(`/bodegas/${id}`);
     return response.data;
  } catch (error) {
     console.error(`Error al obtener la bodega con ID ${id}:`, error);
     throw error;
  }
 };

 
 export const getBodegasRequest = async () => {
  try {
     const response = await axios.get("/bodegas");
     return response.data;
  } catch (error) {
     console.error("Error al obtener las bodegas:", error);
     throw error;
  }
 };
 

import axios from "./axios";

// Comando para Registrar
export const registerRequest = async (user) =>{
  try {
    const response = axios.post(`/auth/register`, user);
    return response.data;

  } catch(error){
    console.error("Error al registrar el usuario", error)
    throw error;
  }
}

export const loginRequest = async (user) =>  {
  try{
    const response =  axios.post(`/auth/login`, user);  
    return response.data;

  } catch(error) {
    console.error("Error al Logearse", error);
    throw error;
  }
}

export const verifyTokenRequest = () => {
  try{
    const response = axios.get(`/auth/verify`);
    return response.data;

  } catch(error){
    console.error("Invalido de Tokern", error);
    throw error;
  }
} 

export const editUserRequest = async (id, user) => {
  try{
    const response = axios.put(`/users/${id}`, user);
    return response.data;
  } catch(error) {
    console.error("No se encuentra el usuario ", error)
    throw error;
  }
}

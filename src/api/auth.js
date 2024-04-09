import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);




export const loginRequest = async (user) => axios.post(`/auth/login`, user);





export const verifyTokenRequest = () => axios.get(`/auth/verify`);




export const editUserRequest = async (id, user) =>
  axios.put(`/users/${id}`, user);
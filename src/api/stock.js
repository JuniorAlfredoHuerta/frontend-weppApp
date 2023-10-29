import axios from "./axios";

export const getstockRequest = () => axios.get("/stock");

export const getstockResponse = () => axios.get("/stock");

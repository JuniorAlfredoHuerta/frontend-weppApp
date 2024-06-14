import axios from "axios";
import Cookies from "js-cookie";
//console.log(Cookies.get());

const instance = axios.create({
  //baseURL: "http://localhost:7000/api",
  baseURL: "https://backend-production-a138.up.railway.app/api",
  headers: {
    Authorization: Cookies.get()?.token,
    tokenbodega: Cookies.get()?.tokenbodega,
  },

  //withCredentials: true,
});

export default instance;

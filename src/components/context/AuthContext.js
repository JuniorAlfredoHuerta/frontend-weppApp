import { createContext, useContext, useEffect, useState } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  editUserRequest,
  editpass,
} from "../../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within and Authprovider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);

      Cookies.set("token", res.data.token);

      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      if (error.response) {
        ////console.log(error.response.data);
        setErrors(error.response.data);
      } else {
        setErrors(["Error de conexión: No se pudo conectar con el servidor"]);
      }
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      Cookies.set("token", res.data.token);

      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        //console.error("Error de conexión:", error.message);
        setErrors(["Error de conexión: No se pudo conectar con el servidor"]);
      }
    }
  };

  const edit = async (user) => {
    try {
      const res = await editpass(user);
      return res;
      setErrors([]);
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors(["Error de conexión: No se pudo conectar con el servidor"]);
      }
    }
  };
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("tokenbodega");

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (id, user) => {
    try {
      //console.log(id, user);
      await editUserRequest(id, user);
    } catch (error) {
      console.error(error);
    }
  };

  const checkLogin = async () => {
    const cookies = Cookies.get();
    //console.log(cookies);
    const cookiedata = cookies.token;
    if (!cookies.token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await verifyTokenRequest();
      //console.log("res", res);
      if (!res.data) {
        //console.log("NO HAY TOKKEN VOLVIENDO AL iNICIO");

        return setIsAuthenticated(false);
      }
      setIsAuthenticated(true);
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        checkLogin,
        updateUser,
        errors,
        setErrors,
        loading,
        edit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

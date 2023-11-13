import { createContext, useContext, useEffect, useState } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  editUserRequest,
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
  const [errors, setErros] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      //console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      //console.log(error.response.data);
      setErros(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      //console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      //console.log(error.response.data);
      setErros(error.response.data);
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
      console.log(id, user);
      await editUserRequest(id, user);
    } catch (error) {
      console.error(error);
    }
  };

  const checkLogin = async () => {
    const cookies = Cookies.get();
    if (!cookies.token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await verifyTokenRequest(cookies.token);
      console.log(res);
      if (!res.data) return setIsAuthenticated(false);
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
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

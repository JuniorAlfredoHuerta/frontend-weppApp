import React from "react";
//import Dictaphone  from './components/add.js';
import MainMenu from "./components/MainMenu";
import {
  BrowserRouter as Router,
  Route,
  useNavigate,
  Link,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import AgregarProducto from "./components/Producto/AddProducto";
import Login from "../src/components/login/login";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./ProtectedRoutes";
import Agregarstock from "./components/Producto/AddStock";
import { BodegaProvider } from "./components/context/BodegaContext";

function App() {
  return (
    <AuthProvider>
      <BodegaProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" Component={Login} />
            <Route element={<ProtectedRoute />}>
              <Route exact path="/mainmenu" Component={MainMenu} />
              <Route exact path="/agregar" Component={Agregarstock} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BodegaProvider>
    </AuthProvider>
  );
}

export default App;

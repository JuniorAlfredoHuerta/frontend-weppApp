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
import AgregarProducto from "./components/Stock/AddStock/AddProducto";
import Login from "../src/components/login/login";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./ProtectedRoutes";
import { BodegaProvider } from "./components/context/BodegaContext";
import { StockProvider } from "./components/context/AddContext";
import SearchStock from "./components/Stock/SearchStock/searchstock";
import StockPage from "./components/Stock/stockPage/stockPage";
import { VentaProvider } from "./components/context/VentaContext";
import CreateVentaPage from "./components/venta/crearVenta/crearVenta";
import GetVentas from "./components/venta/Informe/getVentas";
import Register from "./components/register/register";
import EditPage from "./components/Bodega/editbodega/editbodega";
import Edituser from "./components/User/edituser";

function App() {
  return (
    <AuthProvider>
      <BodegaProvider>
        <BrowserRouter>
          <StockProvider>
            <VentaProvider>
              <Routes>
                <Route exact path="/" Component={Login} />
                <Route exact path="/register" Component={Register} />
                <Route element={<ProtectedRoute />}>
                  <Route exact path="/user" Component={Edituser} />
                  <Route exact path="/editBodega" Component={EditPage} />
                  <Route exact path="/mainmenu" Component={MainMenu} />
                  <Route exact path="/agregar" Component={AgregarProducto} />
                  <Route exact path="/buscar" Component={SearchStock} />
                  <Route exact path="/producto/:id" Component={StockPage} />
                  <Route exact path="/venta" Component={CreateVentaPage} />
                  <Route exact path="/ventas" Component={GetVentas} />
                </Route>
              </Routes>
            </VentaProvider>
          </StockProvider>
        </BrowserRouter>
      </BodegaProvider>
    </AuthProvider>
  );
}

export default App;

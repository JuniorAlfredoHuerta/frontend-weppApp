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

function App() {
  return (
    <AuthProvider>
      <BodegaProvider>
        <BrowserRouter>
          <StockProvider>
            <Routes>
              <Route exact path="/" Component={Login} />
              <Route element={<ProtectedRoute />}>
                <Route exact path="/mainmenu" Component={MainMenu} />
                <Route exact path="/agregar" Component={AgregarProducto} />
                <Route exact path="/buscar" Component={SearchStock} />
                <Route exact path="/producto/:id" Component={StockPage} />
              </Route>
            </Routes>
          </StockProvider>
        </BrowserRouter>
      </BodegaProvider>
    </AuthProvider>
  );
}

export default App;

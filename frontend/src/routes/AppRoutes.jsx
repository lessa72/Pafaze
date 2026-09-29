import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import Amigos from "../pages/Amigos";
import CadastroReceita from "../pages/CadastroReceita";
import CadastroUsuario from "../pages/CadastroUsuario";
import DetalheReceita from "../pages/DetalheReceita";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/amigos" element={<Amigos />} />
          <Route
            path="/receitas/nova"
            element={
              <div className="page-container">
                <CadastroReceita />
              </div>
            }
          />
          <Route
            path="/receitas/:id"
            element={
              <div className="page-container">
                <DetalheReceita />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

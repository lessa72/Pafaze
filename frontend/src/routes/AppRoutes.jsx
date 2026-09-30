import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import Amigos from "../pages/Amigos";
import CadastroReceita from "../pages/CadastroReceita";
import CadastroUsuario from "../pages/CadastroUsuario";
import DetalheReceita from "../pages/DetalheReceita";
import ExplorarReceitas from "../pages/ExplorarReceitas";
import Home from "../pages/Home";
import BuscaPorIngredientes from "../pages/BuscaPorIngredientes";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ExplorarReceitas />} />
          <Route path="/receitas" element={<ExplorarReceitas />} />
          <Route path="/sobre" element={<Home />} />
          <Route path="/login" element={<CadastroUsuario />} />
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
            path="/receitas/ingredientes"
            element={<BuscaPorIngredientes />}
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

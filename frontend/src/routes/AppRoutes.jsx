import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import Amigos from "../pages/Amigos";
import CadastroUsuario from "../pages/CadastroUsuario";
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

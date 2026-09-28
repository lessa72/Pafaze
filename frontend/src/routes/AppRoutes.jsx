import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CadastroReceita from "../pages/CadastroReceita";
import DetalheReceita from "../pages/DetalheReceita";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receitas/nova" element={<CadastroReceita />} />
            <Route path="/receitas/:id" element={<DetalheReceita />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

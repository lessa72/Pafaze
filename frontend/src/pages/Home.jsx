import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("verificando...");
  const [receitas, setReceitas] = useState([]);
  const { usuarioAtivo } = useAuth();

  useEffect(() => {
    apiFetch("/health")
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));

    apiFetch("/api/receitas")
      .then((dados) => setReceitas(dados || []))
      .catch(() => {});
  }, []);

  return (
    <main className="page-container home-page">
      <section className="hero-section">
        <span className="eyebrow">🍳 Pafazê</span>
        <h1 className="hero-title">
          Encontre o que fazer com o que você tem em casa.
        </h1>
        <p className="hero-description">
          Descubra receitas deliciosas com base nos seus ingredientes e
          compartilhe suas criações com seus amigos!
        </p>

        <div className="hero-actions">
          <Link to="/amigos" className="btn btn-primary btn-lg">
            👥 Gerenciar Amigos (US08)
          </Link>
          <Link to="/cadastro" className="btn btn-secondary btn-lg">
            {usuarioAtivo ? "👤 Alternar / Criar Usuário" : "✨ Criar Conta (US01)"}
          </Link>
        </div>

        <div className="api-status-pill">
          <span className={`status-dot ${apiStatus === "online" ? "online" : "offline"}`}></span>
          <span>API Backend: <strong>{apiStatus}</strong></span>
        </div>
      </section>

      <section className="features-grid">
        <div className="card feature-card">
          <span className="feature-icon">👤</span>
          <h3>Criação de Conta (US01)</h3>
          <p>
            Cadastre novos usuários com validação segura de nome, e-mail e hash de senha.
          </p>
          <Link to="/cadastro" className="card-link">
            Acessar Cadastro &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <span className="feature-icon">🤝</span>
          <h3>Amizade & Rede Social (US08)</h3>
          <p>
            Envie e responda a pedidos de amizade, visualize seus amigos conectados e acompanhe novidades.
          </p>
          <Link to="/amigos" className="card-link">
            Acessar Amigos &rarr;
          </Link>
        </div>

        <div className="card feature-card">
          <span className="feature-icon">🍲</span>
          <h3>Receitas Cadastradas</h3>
          <p>
            {receitas.length > 0
              ? `${receitas.length} receitas disponíveis para preparo e avaliação.`
              : "Cadastre e descubra receitas deliciosas."}
          </p>
          <span className="card-hint">Total: {receitas.length} receitas</span>
        </div>
      </section>
    </main>
  );
}

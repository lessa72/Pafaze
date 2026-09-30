import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { usuarioAtivo, todosUsuarios, definirUsuarioAtivo } = useAuth();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand">
          <span className="brand-icon">🍳</span>
          <span className="brand-name">Pafazê</span>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Início
          </Link>
          <Link
            to="/receitas"
            className={`nav-link ${location.pathname === "/receitas" ? "active" : ""}`}
          >
            🔍 Explorar Receitas
          </Link>
          <Link
            to="/receitas/nova"
            className={`nav-link ${location.pathname === "/receitas/nova" ? "active" : ""}`}
          >
            🍳 Publicar Receita
          </Link>
          <Link
            to="/amigos"
            className={`nav-link ${location.pathname === "/amigos" ? "active" : ""}`}
          >
            👥 Amigos
          </Link>
          <Link
            to="/cadastro"
            className={`nav-link ${location.pathname === "/cadastro" ? "active" : ""}`}
          >
            Criar Conta
          </Link>
        </nav>

        <div className="user-profile-badge">
          {usuarioAtivo ? (
            <div className="active-user-pill">
              <span className="user-avatar" title={usuarioAtivo.email}>
                {usuarioAtivo.nome.charAt(0).toUpperCase()}
              </span>
              <div className="user-info">
                <span className="user-name">{usuarioAtivo.nome}</span>
                {todosUsuarios.length > 1 && (
                  <select
                    className="user-switch-select"
                    value={usuarioAtivo.id}
                    onChange={(e) => {
                      const sel = todosUsuarios.find(
                        (u) => u.id === Number(e.target.value)
                      );
                      if (sel) definirUsuarioAtivo(sel);
                    }}
                    title="Alternar perfil ativo"
                  >
                    {todosUsuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ) : (
            <Link to="/cadastro" className="btn-login-prompt">
              👤 Entrar / Cadastrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

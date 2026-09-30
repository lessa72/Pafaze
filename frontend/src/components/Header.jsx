import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { usuarioAtivo, todosUsuarios, definirUsuarioAtivo } = useAuth();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e14a32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a8 8 0 0 0 16 0" />
              <path d="M4 11h16" />
              <path d="M9 3.5v3" />
              <path d="M12 3v3.5" />
              <path d="M15 3.5v3" />
            </svg>
          </span>
          <span className="word">Pafa<span>zê</span></span>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" || location.pathname === "/receitas" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/></svg>
            <span>Explorar</span>
          </Link>
          <Link
            to="/receitas/ingredientes"
            className={`nav-link ${location.pathname === "/receitas/ingredientes" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5c2.2-1.3 5.3-1.3 7.5 0v14c-2.2-1.3-5.3-1.3-7.5 0v-14z"/><path d="M20 5.5c-2.2-1.3-5.3-1.3-7.5 0v14c2.2-1.3 5.3-1.3 7.5 0v-14z"/></svg>
            <span>Ingredientes</span>
          </Link>
          <Link
            to="/receitas/nova"
            className={`nav-link ${location.pathname === "/receitas/nova" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>Publicar</span>
          </Link>
          <Link
            to="/amigos"
            className={`nav-link ${location.pathname === "/amigos" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.5" r="3.5"/><path d="M4.5 20c1.4-4.2 4.3-6.3 7.5-6.3s6.1 2.1 7.5 6.3"/></svg>
            <span>Amigos</span>
          </Link>
          <Link
            to="/login"
            className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Entrar</span>
          </Link>
          <Link
            to="/cadastro"
            className={`nav-link ${location.pathname === "/cadastro" ? "active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            <span>Cadastrar</span>
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
                      const sel = todosUsuarios.find((u) => u.id === Number(e.target.value));
                      if (sel) definirUsuarioAtivo(sel);
                    }}
                    title="Alternar perfil ativo"
                  >
                    {todosUsuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-login-prompt">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

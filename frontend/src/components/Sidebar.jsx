import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="side">
      <div className="brand">
        <span className="brand-mark">
          <svg viewBox="0 0 24 24">
            <path d="M4 11a8 8 0 0 0 16 0" />
            <path d="M4 11h16" />
            <path d="M9 3.5v3" />
            <path d="M12 3v3.5" />
            <path d="M15 3.5v3" />
          </svg>
        </span>
        <span className="word">Pafa<span>zê</span></span>
      </div>

      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} end>
        <span className="ic">
          <svg viewBox="0 0 24 24">
            <path d="M4 11 12 4l8 7" />
            <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
          </svg>
        </span>
        <span className="txt">Início</span>
      </NavLink>

      <NavLink to="/receitas/nova" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="ic">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </span>
        <span className="txt">Publicar receita</span>
      </NavLink>
    </nav>
  );
}

export default function BannerAmigos({ usuarioAtivo }) {
  return (
    <div className="friends-header-banner">
      <span className="eyebrow">US08 — Fazer Amigos</span>
      <h1>Comunidade & Amizades</h1>
      <p className="subtitle">
        Conectado como <strong>{usuarioAtivo.nome}</strong> ({usuarioAtivo.email})
      </p>
    </div>
  );
}

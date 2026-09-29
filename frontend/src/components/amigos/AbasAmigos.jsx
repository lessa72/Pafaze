export default function AbasAmigos({
  abaAtiva,
  setAbaAtiva,
  totalAmigos,
  totalPedidos,
}) {
  return (
    <div className="tabs-container">
      <button
        className={`tab-button ${abaAtiva === "amigos" ? "active" : ""}`}
        onClick={() => setAbaAtiva("amigos")}
      >
        Meus Amigos ({totalAmigos})
      </button>
      <button
        className={`tab-button ${abaAtiva === "pedidos" ? "active" : ""}`}
        onClick={() => setAbaAtiva("pedidos")}
      >
        Pedidos Pendentes
        {totalPedidos > 0 && <span className="tab-badge">{totalPedidos}</span>}
      </button>
      <button
        className={`tab-button ${abaAtiva === "buscar" ? "active" : ""}`}
        onClick={() => setAbaAtiva("buscar")}
      >
        🔍 Encontrar Amigos
      </button>
    </div>
  );
}

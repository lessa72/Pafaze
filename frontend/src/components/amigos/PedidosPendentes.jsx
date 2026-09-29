export default function PedidosPendentes({ pedidos, carregando, onResponder }) {
  if (carregando) {
    return <p className="loading-text">Carregando solicitações...</p>;
  }

  if (pedidos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📬</span>
        <p>Você não possui nenhum pedido de amizade pendente no momento.</p>
      </div>
    );
  }

  return (
    <div className="requests-list">
      {pedidos.map((pedido) => (
        <div className="request-card" key={pedido.solicitante.id}>
          <div className="friend-avatar">
            {pedido.solicitante.nome.charAt(0).toUpperCase()}
          </div>
          <div className="friend-details">
            <h3 className="friend-name">{pedido.solicitante.nome}</h3>
            <p className="friend-email">{pedido.solicitante.email}</p>
            <span className="request-time">
              Solicitado em{" "}
              {new Date(pedido.criado_em).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="request-actions">
            <button
              className="btn btn-success btn-sm"
              onClick={() =>
                onResponder(pedido.solicitante.id, "aceito", pedido.solicitante.nome)
              }
            >
              ✓ Aceitar
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() =>
                onResponder(pedido.solicitante.id, "recusado", pedido.solicitante.nome)
              }
            >
              ✕ Recusar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

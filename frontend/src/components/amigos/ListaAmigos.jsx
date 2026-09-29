export default function ListaAmigos({ amigos, carregando, onRemover, onIrBuscar }) {
  if (carregando) {
    return <p className="loading-text">Carregando seus amigos...</p>;
  }

  if (amigos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🤝</span>
        <p>Você ainda não adicionou nenhum amigo.</p>
        <button className="btn btn-secondary" onClick={onIrBuscar}>
          Buscar cozinheiros na plataforma
        </button>
      </div>
    );
  }

  return (
    <div className="friends-grid">
      {amigos.map((amigo) => (
        <div className="friend-card" key={amigo.id}>
          <div className="friend-avatar">
            {amigo.nome.charAt(0).toUpperCase()}
          </div>
          <div className="friend-details">
            <h3 className="friend-name">{amigo.nome}</h3>
            <p className="friend-email">{amigo.email}</p>
            <span className="badge-connected">✓ Amigo Conectado</span>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onRemover(amigo.id, amigo.nome)}
            title="Desfazer amizade"
          >
            Desfazer amizade
          </button>
        </div>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";

export default function BuscarAmigos({
  usuarios,
  termoBusca,
  setTermoBusca,
  idsAmigos,
  idsPedidosRecebidos,
  onEnviarPedido,
  onResponderPedido,
  onRemoverAmigo,
}) {
  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Digite o nome ou e-mail de um usuário..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </div>

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum outro usuário encontrado para esta busca.</p>
          <Link to="/cadastro" className="btn btn-secondary">
            Cadastrar mais usuários de teste
          </Link>
        </div>
      ) : (
        <div className="friends-grid">
          {usuarios.map((outro) => {
            const ehAmigo = idsAmigos.has(outro.id);
            const ehPedidoRecebido = idsPedidosRecebidos.has(outro.id);

            return (
              <div className="friend-card" key={outro.id}>
                <div className="friend-avatar">
                  {outro.nome.charAt(0).toUpperCase()}
                </div>
                <div className="friend-details">
                  <h3 className="friend-name">{outro.nome}</h3>
                  <p className="friend-email">{outro.email}</p>
                  {ehAmigo && (
                    <span className="badge-connected">✓ Já são amigos</span>
                  )}
                  {ehPedidoRecebido && (
                    <span className="badge-pending">
                      📩 Te enviou um pedido
                    </span>
                  )}
                </div>
                <div>
                  {ehAmigo ? (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onRemoverAmigo(outro.id, outro.nome)}
                    >
                      Remover
                    </button>
                  ) : ehPedidoRecebido ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        onResponderPedido(outro.id, "aceito", outro.nome)
                      }
                    >
                      Aceitar Pedido
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEnviarPedido(outro.id, outro.nome)}
                    >
                      ➕ Adicionar Amigo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

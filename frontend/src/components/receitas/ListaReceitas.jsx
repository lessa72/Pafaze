import ReceitaCard from "./ReceitaCard";

export default function ListaReceitas({
  receitas = [],
  carregando = false,
  erro = "",
  aoLimparFiltros,
}) {
  if (carregando) {
    return (
      <div className="receitas-feedback carregando">
        <span className="feedback-icone">⏳</span>
        <p>Buscando receitas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="alert alert-error" role="alert">
        <span>⚠️</span> {erro}
      </div>
    );
  }

  if (receitas.length === 0) {
    return (
      <div className="card receitas-feedback vazio">
        <span className="feedback-icone">🍳</span>
        <h3>Nenhuma receita encontrada</h3>
        <p>Tente buscar por outro nome ou selecionar outra categoria.</p>
        {aoLimparFiltros && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={aoLimparFiltros}
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="receitas-grid">
      {receitas.map((receita) => (
        <ReceitaCard key={receita.id} receita={receita} />
      ))}
    </div>
  );
}

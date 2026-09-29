export default function BarraPesquisa({ valor = "", aoMudar }) {
  return (
    <div className="barra-pesquisa-container">
      <span className="barra-pesquisa-icone" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        className="barra-pesquisa-input"
        placeholder="Pesquisar receita por nome (ex: Bolo, Sopa)..."
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        aria-label="Pesquisar receitas pelo nome"
      />
      {valor && (
        <button
          type="button"
          className="barra-pesquisa-limpar"
          onClick={() => aoMudar("")}
          title="Limpar pesquisa"
          aria-label="Limpar campo de pesquisa"
        >
          ✕
        </button>
      )}
    </div>
  );
}

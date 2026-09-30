export default function OrdenadorAvaliacao({
  ordenarPor = "",
  ordem = "desc",
  aoMudarOrdenacao,
}) {
  const valorAtual = ordenarPor ? `${ordenarPor}:${ordem}` : "";

  function handleChange(e) {
    const val = e.target.value;
    if (!val) {
      aoMudarOrdenacao({ ordenarPor: "", ordem: "desc" });
    } else {
      const [novoCriterio, novaOrdem] = val.split(":");
      aoMudarOrdenacao({ ordenarPor: novoCriterio, ordem: novaOrdem });
    }
  }

  return (
    <div className="ordenador-container">
      <label htmlFor="select-ordenacao" className="ordenador-label">
        Ordenar por:
      </label>
      <select
        id="select-ordenacao"
        className="ordenador-select"
        value={valorAtual}
        onChange={handleChange}
        aria-label="Critério de ordenação de receitas"
      >
        <option value="">Padrão (Mais recentes)</option>
        <option value="avaliacao:desc">⭐ Mais bem avaliadas</option>
        <option value="avaliacao:asc">Menor avaliação</option>
      </select>
    </div>
  );
}

export default function FiltroCategoria({
  categorias = [],
  categoriaSelecionada = "",
  aoSelecionar,
}) {
  return (
    <div className="filtro-categoria-container" role="group" aria-label="Filtrar receitas por categoria">
      <button
        type="button"
        className={`filtro-categoria-pill ${categoriaSelecionada === "" ? "ativa" : ""}`}
        onClick={() => aoSelecionar("")}
      >
        Todas
      </button>

      {categorias.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`filtro-categoria-pill ${categoriaSelecionada === cat ? "ativa" : ""}`}
          onClick={() => aoSelecionar(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

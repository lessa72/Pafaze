import BarraPesquisa from "../components/receitas/BarraPesquisa";
import FiltroCategoria from "../components/receitas/FiltroCategoria";
import ListaReceitas from "../components/receitas/ListaReceitas";
import OrdenadorAvaliacao from "../components/receitas/OrdenadorAvaliacao";
import { useReceitas } from "../hooks/useReceitas";

export default function ExplorarReceitas() {
  const {
    receitas,
    categorias,
    termoBusca,
    setTermoBusca,
    categoriaAtiva,
    setCategoriaAtiva,
    ordenarPor,
    ordem,
    definirOrdenacao,
    carregando,
    erro,
  } = useReceitas();

  function limparFiltros() {
    setTermoBusca("");
    setCategoriaAtiva("");
    definirOrdenacao({ ordenarPor: "avaliacao", ordem: "desc" });
  }

  return (
    <div className="page-container explorar-receitas-page">
      <header className="explorar-header">
        <span className="eyebrow">🍳 Cardápio & Comunidade</span>
        <h1>Explorar Receitas</h1>
        <p className="explorar-subtitulo">
          Pesquise pelo nome, filtre por categorias e descubra as receitas mais bem avaliadas da plataforma!
        </p>
      </header>

      <section className="controles-busca-secao">
        <BarraPesquisa valor={termoBusca} aoMudar={setTermoBusca} />

        <div className="controles-filtros-linha">
          <FiltroCategoria
            categorias={categorias}
            categoriaSelecionada={categoriaAtiva}
            aoSelecionar={setCategoriaAtiva}
          />
          <OrdenadorAvaliacao
            ordenarPor={ordenarPor}
            ordem={ordem}
            aoMudarOrdenacao={definirOrdenacao}
          />
        </div>
      </section>

      <section className="resultados-secao">
        <div className="resultados-info">
          <span>
            {carregando
              ? "Carregando..."
              : `${receitas.length} ${receitas.length === 1 ? "receita encontrada" : "receitas encontradas"}`}
          </span>
          {(termoBusca || categoriaAtiva) && (
            <button type="button" className="btn-link-limpar" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>

        <ListaReceitas
          receitas={receitas}
          carregando={carregando}
          erro={erro}
          aoLimparFiltros={limparFiltros}
        />
      </section>
    </div>
  );
}

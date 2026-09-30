import BuscaIngredientes from "../components/BuscaIngredientes";

export default function BuscaPorIngredientes() {
  return (
    <main className="page-container busca-ingredientes-page">
      <header className="explorar-header">
        <span className="eyebrow">🥕 US07</span>

        <h1>Receitas com o que você tem</h1>

        <p className="explorar-subtitulo">
          Informe os ingredientes disponíveis em casa e encontre as receitas
          mais compatíveis.
        </p>
      </header>

      <BuscaIngredientes />
    </main>
  );
}
import { useState } from "react";
import { apiFetch } from "../api/client";

export default function BuscaIngredientes() {
  const [entrada, setEntrada] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  function adicionarIngrediente(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const nome = entrada.trim();

    if (!nome || ingredientes.includes(nome.toLowerCase())) {
      return;
    }

    setIngredientes([...ingredientes, nome.toLowerCase()]);
    setEntrada("");
  }

  function removerIngrediente(nome) {
    setIngredientes(ingredientes.filter((ingrediente) => ingrediente !== nome));
  }

  async function buscarReceitas() {
    if (ingredientes.length === 0) {
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const params = new URLSearchParams();

      ingredientes.forEach((ingrediente) => {
        params.append("ingredientes", ingrediente);
      });

      const resultado = await apiFetch(
        `/api/receitas/compatibilidade?${params.toString()}`
      );

      setReceitas(resultado);
    } catch {
      setErro("Não foi possível buscar as receitas.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="busca-ingredientes">
      <h2>O que você tem em casa?</h2>

      <p>
        Informe os ingredientes disponíveis para encontrar receitas compatíveis.
      </p>

      <input
        type="text"
        value={entrada}
        onChange={(event) => setEntrada(event.target.value)}
        onKeyDown={adicionarIngrediente}
        placeholder="Digite um ingrediente e pressione Enter"
      />

      {ingredientes.length > 0 && (
        <div className="ingredientes-selecionados">
          {ingredientes.map((ingrediente) => (
            <span key={ingrediente} className="ingrediente-tag">
              {ingrediente}
              <button
                type="button"
                onClick={() => removerIngrediente(ingrediente)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={buscarReceitas}
        disabled={carregando || ingredientes.length === 0}
      >
        {carregando ? "Buscando..." : "Buscar receitas"}
      </button>

      {erro && <p className="erro">{erro}</p>}

      {receitas.length > 0 && (
        <div className="resultado-receitas">
          <h2>Receitas mais compatíveis</h2>

          {receitas.map((receita) => (
            <article key={receita.id} className="receita-card">
              <h3>{receita.nome}</h3>

              <p>{receita.categoria}</p>

              <p>
                {receita.ingredientes_disponiveis} de{" "}
                {receita.total_ingredientes} ingredientes disponíveis
              </p>

              <p>
                {receita.ingredientes_faltantes === 0
                  ? "Você tem todos os ingredientes!"
                  : `Faltam ${receita.ingredientes_faltantes} ingrediente(s).`}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
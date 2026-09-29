import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function CadastroReceita() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Café da manhã");
  const [modoPreparo, setModoPreparo] = useState("");
  const [ingredientes, setIngredientes] = useState([
    { nome: "", quantidade: "" },
    { nome: "", quantidade: "" },
  ]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function atualizar(index, campo, valor) {
    setIngredientes((itens) => itens.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const lista = ingredientes
      .map((i) => ({ nome: i.nome.trim(), quantidade: i.quantidade.trim() }))
      .filter((i) => i.nome && i.quantidade);

    if (!nome.trim() || !modoPreparo.trim() || lista.length === 0) {
      setErro("Preencha o nome, modo de preparo e pelo menos um ingrediente (nome e quantidade).");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      const receita = await apiFetch("/api/receitas", {
        method: "POST",
        body: JSON.stringify({ nome: nome.trim(), categoria, modo_preparo: modoPreparo.trim(), usuario_id: 1, ingredientes: lista }),
      });
      navigate(`/receitas/${receita.id}`);
    } catch (err) {
      setErro(err.message || "Erro ao publicar receita. Verifique se o backend está rodando.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h2>Nova publicação</h2>
      {erro && <p style={{ color: "var(--saffron)", fontSize: "13px" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nome da receita</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="ex: Omelete de cebola e tomate" />

        <label>Categoria</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {["Café da manhã", "Almoço", "Jantar", "Sobremesa"].map((c) => <option key={c}>{c}</option>)}
        </select>

        <label>Ingredientes</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {ingredientes.map((ing, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                value={ing.nome}
                onChange={(e) => atualizar(i, "nome", e.target.value)}
                placeholder="Ingrediente (ex: Ovo)"
                style={{ flex: 1 }}
              />
              <input
                value={ing.quantidade}
                onChange={(e) => atualizar(i, "quantidade", e.target.value)}
                placeholder="Qtd (ex: 2 unidades)"
                style={{ width: "150px", flex: "none" }}
              />
              {ingredientes.length > 1 && (
                <button
                  type="button"
                  className="btn ghost"
                  style={{ padding: "8px 12px", border: "none", color: "var(--olive-dk)", cursor: "pointer" }}
                  onClick={() => setIngredientes((itens) => itens.filter((_, idx) => idx !== i))}
                  title="Remover ingrediente"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn ghost"
            onClick={() => setIngredientes((itens) => [...itens, { nome: "", quantidade: "" }])}
            style={{ alignSelf: "flex-start", marginTop: "4px", fontSize: "13px" }}
          >
            + Adicionar outro ingrediente
          </button>
        </div>

        <label>Modo de preparo</label>
        <textarea value={modoPreparo} onChange={(e) => setModoPreparo(e.target.value)} placeholder="Descreva o passo a passo..." />

        <button type="submit" className="btn" disabled={salvando} style={{ marginTop: "16px" }}>
          {salvando ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}

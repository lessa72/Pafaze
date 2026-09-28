import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function CadastroReceita() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Café da manhã");
  const [modoPreparo, setModoPreparo] = useState("");
  const [ingNome, setIngNome] = useState("");
  const [ingQtd, setIngQtd] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function adicionarIngrediente(e) {
    e.preventDefault();
    if (ingNome.trim() && ingQtd.trim()) {
      setIngredientes([...ingredientes, { nome: ingNome.trim(), quantidade: ingQtd.trim() }]);
      setIngNome("");
      setIngQtd("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim() || !modoPreparo.trim() || ingredientes.length === 0) {
      setErro("Preencha todos os campos e adicione pelo menos um ingrediente.");
      return;
    }
    try {
      setSalvando(true);
      setErro("");
      const receita = await apiFetch("/api/receitas", {
        method: "POST",
        body: JSON.stringify({ nome: nome.trim(), categoria, modo_preparo: modoPreparo.trim(), usuario_id: 1, ingredientes }),
      });
      navigate(`/receitas/${receita.id}`);
    } catch {
      setErro("Erro ao publicar receita. Verifique se o backend está rodando.");
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
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input value={ingNome} onChange={(e) => setIngNome(e.target.value)} placeholder="Nome (ex: Ovo)" />
          <input value={ingQtd} onChange={(e) => setIngQtd(e.target.value)} placeholder="Qtd (ex: 2 unidades)" style={{ width: "160px" }} />
          <button type="button" className="btn ghost" onClick={adicionarIngrediente}>+</button>
        </div>
        <div>
          {ingredientes.map((ing, i) => (
            <span key={i} className="ing-tag">
              {ing.quantidade} {ing.nome}
              <button type="button" onClick={() => setIngredientes(ingredientes.filter((_, idx) => idx !== i))}>✕</button>
            </span>
          ))}
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

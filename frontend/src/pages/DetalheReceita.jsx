import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import AvaliacaoEstrelas from "../components/AvaliacaoEstrelas";
import Comentarios from "../components/Comentarios";

export default function DetalheReceita() {
  const { id } = useParams();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarReceita(mostrarCarregando = false) {
    try {
      if (mostrarCarregando === true) setCarregando(true);
      const dados = await apiFetch(`/api/receitas/${id}`);
      setReceita(dados);
    } catch {
      setErro("Receita não encontrada ou erro no servidor.");
    } finally {
      if (mostrarCarregando === true) setCarregando(false);
    }
  }

  useEffect(() => {
    carregarReceita(true);
  }, [id]);

  if (carregando) return <p className="meta" style={{ padding: "24px" }}>Carregando receita...</p>;
  if (erro || !receita) return <p style={{ color: "var(--saffron)", padding: "24px" }}>{erro}</p>;

  return (
    <div style={{ maxWidth: "700px" }}>
      <h2>{receita.nome}</h2>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "-10px", marginBottom: "16px" }}>
        <span className="stars">★ {receita.media_avaliacao}</span>
        <span className="meta">· {receita.total_avaliacoes} avaliações · {receita.categoria}</span>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>Ingredientes</div>
        <div>
          {receita.ingredientes?.map((ing, i) => (
            <span key={i} className="pill">{ing.quantidade} {ing.nome}</span>
          ))}
        </div>

        <div className="section-title">Modo de preparo</div>
        <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{receita.modo_preparo}</p>

        <AvaliacaoEstrelas receitaId={receita.id} onAvaliado={() => carregarReceita(false)} />
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <Comentarios receitaId={receita.id} usuarioId={1} />
      </div>
    </div>
  );
}

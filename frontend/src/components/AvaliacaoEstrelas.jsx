import { useState } from "react";
import { apiFetch } from "../api/client";

export default function AvaliacaoEstrelas({ receitaId, usuarioId = 1, onAvaliado }) {
  const [notaHover, setNotaHover] = useState(0);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleAvaliar(nota) {
    try {
      setEnviando(true);
      setMensagem("");
      const dados = await apiFetch(`/api/receitas/${receitaId}/avaliacoes`, {
        method: "POST",
        body: JSON.stringify({ usuario_id: usuarioId, nota }),
      });
      setNotaSelecionada(nota);
      setMensagem("Avaliação enviada!");
      if (onAvaliado) onAvaliado(dados);
    } catch {
      setMensagem("Erro ao enviar avaliação.");
    } finally {
      setEnviando(false);
    }
  }

  const notaExibida = notaHover || notaSelecionada;

  return (
    <div className="avaliacao-box">
      <div className="section-title">Sua avaliação</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span className="stars" style={{ cursor: enviando ? "default" : "pointer" }}>
          {[1, 2, 3, 4, 5].map((estrela) => (
            <span
              key={estrela}
              onMouseEnter={() => !enviando && setNotaHover(estrela)}
              onMouseLeave={() => !enviando && setNotaHover(0)}
              onClick={() => !enviando && handleAvaliar(estrela)}
              style={{ padding: "0 2px" }}
            >
              {estrela <= notaExibida ? "★" : "☆"}
            </span>
          ))}
        </span>
        {mensagem && <span className="meta" style={{ marginLeft: "6px" }}>{mensagem}</span>}
      </div>
    </div>
  );
}

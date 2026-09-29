import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function AvaliacaoEstrelas({ receitaId, usuarioId = 1, onAvaliado }) {
  const storageKey = `avaliacao_${receitaId}_${usuarioId}`;
  const [notaHover, setNotaHover] = useState(0);
  const [notaSelecionada, setNotaSelecionada] = useState(() => {
    try {
      const salva = localStorage.getItem(storageKey);
      return salva ? Number(salva) : 0;
    } catch {
      return 0;
    }
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    try {
      const salva = localStorage.getItem(storageKey);
      setNotaSelecionada(salva ? Number(salva) : 0);
    } catch {
      setNotaSelecionada(0);
    }
    setMensagem("");
  }, [receitaId, usuarioId, storageKey]);

  async function handleAvaliar(nota) {
    setNotaSelecionada(nota);
    try {
      localStorage.setItem(storageKey, String(nota));
    } catch {
      // ignora restricoes de storage
    }

    try {
      setEnviando(true);
      setMensagem("");
      const dados = await apiFetch(`/api/receitas/${receitaId}/avaliacoes`, {
        method: "POST",
        body: JSON.stringify({ usuario_id: usuarioId, nota }),
      });
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
        <span
          className="stars"
          style={{ cursor: enviando ? "default" : "pointer", userSelect: "none" }}
          onMouseLeave={() => !enviando && setNotaHover(0)}
        >
          {[1, 2, 3, 4, 5].map((estrela) => (
            <span
              key={estrela}
              onMouseEnter={() => !enviando && setNotaHover(estrela)}
              onClick={() => !enviando && handleAvaliar(estrela)}
              style={{ padding: "0 2px" }}
              title={`${estrela} estrela${estrela > 1 ? "s" : ""}`}
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

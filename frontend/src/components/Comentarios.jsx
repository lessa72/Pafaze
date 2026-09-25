import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Comentarios({ receitaId, usuarioId }) {
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarComentarios() {
      try {
        const dados = await apiFetch(
          `/api/receitas/${receitaId}/comentarios`
        );
        setComentarios(dados);
      } catch {
        setErro("Não foi possível carregar os comentários.");
      } finally {
        setCarregando(false);
      }
    }

    carregarComentarios();
  }, [receitaId]);

  async function enviarComentario(event) {
    event.preventDefault();

    if (!texto.trim()) {
      return;
    }

    try {
      setEnviando(true);
      setErro("");

      const comentario = await apiFetch(
        `/api/receitas/${receitaId}/comentarios`,
        {
          method: "POST",
          body: JSON.stringify({
            usuario_id: usuarioId,
            texto: texto.trim(),
          }),
        }
      );

      setComentarios((anteriores) => [...anteriores, comentario]);
      setTexto("");
    } catch {
      setErro("Não foi possível publicar o comentário.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="comentarios">
      <h2>Comentários</h2>

      {carregando && <p>Carregando comentários...</p>}

      {!carregando && comentarios.length === 0 && (
        <p>Ainda não há comentários. Seja o primeiro!</p>
      )}

      {comentarios.map((comentario) => (
        <article className="comentario" key={comentario.id}>
          <p>{comentario.texto}</p>
          <small>Usuário {comentario.usuario_id}</small>
        </article>
      ))}

      <form onSubmit={enviarComentario}>
        <label htmlFor="texto-comentario">
          Deixe seu comentário
        </label>

        <textarea
          id="texto-comentario"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Compartilhe sua experiência ou uma dica..."
          maxLength={1000}
          rows={4}
          disabled={enviando}
        />

        <button type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? "Publicando..." : "Publicar comentário"}
        </button>
      </form>

      {erro && <p role="alert">{erro}</p>}
    </section>
  );
}
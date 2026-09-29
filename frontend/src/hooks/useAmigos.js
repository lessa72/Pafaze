import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export function useAmigos(usuarioAtivo, carregarUsuarios) {
  const [amigos, setAmigos] = useState([]);
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  function mostrarFeedback(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  }

  async function atualizarDadosAmizade() {
    if (!usuarioAtivo) return;
    setCarregando(true);
    try {
      const [listaAmigos, listaPedidos] = await Promise.all([
        apiFetch(`/api/usuarios/${usuarioAtivo.id}/amigos`),
        apiFetch(`/api/usuarios/${usuarioAtivo.id}/amigos/pedidos`),
      ]);
      setAmigos(listaAmigos);
      setPedidosPendentes(listaPedidos);
      if (carregarUsuarios) await carregarUsuarios();
    } catch {
      mostrarFeedback("erro", "Erro ao carregar dados de amigos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    atualizarDadosAmizade();
  }, [usuarioAtivo?.id]);

  async function handleEnviarPedido(amigoId, nomeAmigo) {
    try {
      await apiFetch(`/api/usuarios/${usuarioAtivo.id}/amigos/${amigoId}`, {
        method: "POST",
      });
      mostrarFeedback("sucesso", `Pedido enviado para ${nomeAmigo}!`);
      await atualizarDadosAmizade();
    } catch (err) {
      mostrarFeedback("erro", err.message || "Não foi possível enviar o pedido.");
    }
  }

  async function handleResponderPedido(solicitanteId, status, nomeSolicitante) {
    try {
      await apiFetch(`/api/usuarios/${usuarioAtivo.id}/amigos/${solicitanteId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      mostrarFeedback(
        "sucesso",
        status === "aceito"
          ? `Você e ${nomeSolicitante} agora são amigos!`
          : `Pedido de ${nomeSolicitante} recusado.`
      );
      await atualizarDadosAmizade();
    } catch (err) {
      mostrarFeedback("erro", err.message || "Erro ao responder pedido.");
    }
  }

  async function handleRemoverAmigo(amigoId, nomeAmigo) {
    if (!window.confirm(`Desfazer a amizade com ${nomeAmigo}?`)) return;
    try {
      await apiFetch(`/api/usuarios/${usuarioAtivo.id}/amigos/${amigoId}`, {
        method: "DELETE",
      });
      mostrarFeedback("sucesso", `Amizade com ${nomeAmigo} desfeita.`);
      await atualizarDadosAmizade();
    } catch (err) {
      mostrarFeedback("erro", err.message || "Erro ao desfazer amizade.");
    }
  }

  return {
    amigos,
    pedidosPendentes,
    carregando,
    mensagem,
    handleEnviarPedido,
    handleResponderPedido,
    handleRemoverAmigo,
  };
}

import { useState } from "react";
import { Link } from "react-router-dom";
import AbasAmigos from "../components/amigos/AbasAmigos";
import BannerAmigos from "../components/amigos/BannerAmigos";
import BuscarAmigos from "../components/amigos/BuscarAmigos";
import ListaAmigos from "../components/amigos/ListaAmigos";
import PedidosPendentes from "../components/amigos/PedidosPendentes";
import { useAuth } from "../context/AuthContext";
import { useAmigos } from "../hooks/useAmigos";

export default function Amigos() {
  const { usuarioAtivo, todosUsuarios, carregarUsuarios } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState("amigos");
  const [termoBusca, setTermoBusca] = useState("");

  const {
    amigos,
    pedidosPendentes,
    carregando,
    mensagem,
    handleEnviarPedido,
    handleResponderPedido,
    handleRemoverAmigo,
  } = useAmigos(usuarioAtivo, carregarUsuarios);

  if (!usuarioAtivo) {
    return (
      <div className="page-container">
        <div className="card prompt-card">
          <h2>👥 Conecte-se com Amigos</h2>
          <p>Você precisa criar uma conta para gerenciar suas amizades no Pafazê.</p>
          <Link to="/cadastro" className="btn btn-primary">
            Criar minha conta agora
          </Link>
        </div>
      </div>
    );
  }

  const idsAmigos = new Set(amigos.map((a) => a.id));
  const idsPedidosRecebidos = new Set(pedidosPendentes.map((p) => p.solicitante.id));
  const outrosUsuarios = todosUsuarios.filter(
    (u) =>
      u.id !== usuarioAtivo.id &&
      (termoBusca === "" ||
        u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        u.email.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  return (
    <div className="page-container">
      <BannerAmigos usuarioAtivo={usuarioAtivo} />
      {mensagem && (
        <div className={`alert ${mensagem.tipo === "sucesso" ? "alert-success" : "alert-error"}`} role="alert">
          <span>{mensagem.tipo === "sucesso" ? "✅" : "⚠️"}</span> {mensagem.texto}
        </div>
      )}
      <AbasAmigos
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        totalAmigos={amigos.length}
        totalPedidos={pedidosPendentes.length}
      />
      <div className="card tab-content">
        {abaAtiva === "amigos" && (
          <ListaAmigos amigos={amigos} carregando={carregando} onRemover={handleRemoverAmigo} onIrBuscar={() => setAbaAtiva("buscar")} />
        )}
        {abaAtiva === "pedidos" && (
          <PedidosPendentes pedidos={pedidosPendentes} carregando={carregando} onResponder={handleResponderPedido} />
        )}
        {abaAtiva === "buscar" && (
          <BuscarAmigos
            usuarios={outrosUsuarios}
            termoBusca={termoBusca}
            setTermoBusca={setTermoBusca}
            idsAmigos={idsAmigos}
            idsPedidosRecebidos={idsPedidosRecebidos}
            onEnviarPedido={handleEnviarPedido}
            onResponderPedido={handleResponderPedido}
            onRemoverAmigo={handleRemoverAmigo}
          />
        )}
      </div>
    </div>
  );
}

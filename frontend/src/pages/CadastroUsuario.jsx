import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCadastro from "../components/usuarios/FormCadastro";
import { useAuth } from "../context/AuthContext";

export default function CadastroUsuario() {
  const { cadastrarUsuario, todosUsuarios, definirUsuarioAtivo, usuarioAtivo } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    if (nome.trim().length < 2) return setErro("O nome deve ter pelo menos 2 caracteres.");
    if (!email.includes("@") || !email.includes(".")) return setErro("Insira um e-mail válido.");
    if (senha.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.");
    if (senha !== confirmaSenha) return setErro("As senhas não coincidem.");

    try {
      setCarregando(true);
      await cadastrarUsuario({ nome: nome.trim(), email: email.trim().toLowerCase(), senha });
      setSucesso(true);
      setTimeout(() => navigate("/amigos"), 1500);
    } catch (err) {
      setErro(err.message || "Erro ao criar conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card form-card">
        <div className="form-header">
          <span className="form-badge">US01 — Criar Conta</span>
          <h1>Cadastre-se no Pafazê</h1>
          <p className="form-subtitle">Crie sua conta para compartilhar receitas e interagir com amigos!</p>
        </div>

        {erro && <div className="alert alert-error" role="alert"><span>⚠️</span> {erro}</div>}
        {sucesso && <div className="alert alert-success" role="alert"><span>🎉</span> Conta criada com sucesso!</div>}

        <FormCadastro
          nome={nome} setNome={setNome}
          email={email} setEmail={setEmail}
          senha={senha} setSenha={setSenha}
          confirmaSenha={confirmaSenha} setConfirmaSenha={setConfirmaSenha}
          carregando={carregando} onSubmit={handleSubmit}
        />

        <div className="existing-users-section">
          <h3>👥 Usuários Cadastrados ({todosUsuarios.length})</h3>
          <p className="hint">Clique em um usuário para alternar o perfil ativo e testar pedidos de amizade:</p>
          <div className="users-pill-grid">
            {todosUsuarios.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`user-select-btn ${usuarioAtivo?.id === u.id ? "selected" : ""}`}
                onClick={() => definirUsuarioAtivo(u)}
              >
                <span className="user-avatar-mini">{u.nome.charAt(0).toUpperCase()}</span>
                <span className="user-name-mini">{u.nome}</span>
                {usuarioAtivo?.id === u.id && <span className="current-indicator">✓ Ativo</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

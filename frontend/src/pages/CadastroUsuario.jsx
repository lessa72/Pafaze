import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCadastro from "../components/usuarios/FormCadastro";
import { useAuth } from "../context/AuthContext";

export default function CadastroUsuario() {
  const { cadastrarUsuario, loginUsuario, todosUsuarios, definirUsuarioAtivo, usuarioAtivo } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState("cadastro"); // "cadastro" | "login"
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

    if (modo === "cadastro" && nome.trim().length < 2) return setErro("O nome deve ter pelo menos 2 caracteres.");
    if (!email.includes("@") || !email.includes(".")) return setErro("Insira um e-mail válido.");
    if (modo === "cadastro" && senha.length < 6) return setErro("A senha deve ter no mínimo 6 caracteres.");
    if (modo === "cadastro" && senha !== confirmaSenha) return setErro("As senhas não coincidem.");

    try {
      setCarregando(true);
      if (modo === "cadastro") {
        await cadastrarUsuario({ nome: nome.trim(), email: email.trim().toLowerCase(), senha });
      } else {
        await loginUsuario({ email: email.trim().toLowerCase(), senha });
      }
      setSucesso(true);
      setTimeout(() => navigate("/amigos"), 1000);
    } catch (err) {
      setErro(err.message || (modo === "cadastro" ? "Erro ao criar conta." : "Erro ao entrar."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card form-card">
        <div className="form-header">
          <span className="form-badge">Autenticação & Contas</span>
          <h1>{modo === "cadastro" ? "Cadastre-se no Pafazê" : "Entrar no Pafazê"}</h1>
          <p className="form-subtitle">
            {modo === "cadastro"
              ? "Crie sua conta para compartilhar receitas e fazer amigos!"
              : "Acesse sua conta com e-mail e senha cadastrados."}
          </p>
        </div>

        <div className="tabs-container" style={{ marginBottom: "20px" }}>
          <button
            type="button"
            className={`tab-button ${modo === "cadastro" ? "active" : ""}`}
            onClick={() => { setModo("cadastro"); setErro(""); }}
          >
            Cadastrar
          </button>
          <button
            type="button"
            className={`tab-button ${modo === "login" ? "active" : ""}`}
            onClick={() => { setModo("login"); setErro(""); }}
          >
            Entrar com Senha
          </button>
        </div>

        {erro && <div className="alert alert-error" role="alert"><span>⚠️</span> {erro}</div>}
        {sucesso && (
          <div className="alert alert-success" role="alert">
            <span>🎉</span> {modo === "cadastro" ? "Conta criada com sucesso!" : "Login realizado com sucesso!"}
          </div>
        )}

        <FormCadastro
          modo={modo}
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

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioAtivo, setUsuarioAtivo] = useState(() => {
    const salvo = localStorage.getItem("pafaze_usuario_ativo");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarUsuarios() {
    try {
      const dados = await apiFetch("/api/usuarios");
      setTodosUsuarios(dados);
      if (usuarioAtivo && !dados.some((u) => u.id === usuarioAtivo.id)) {
        definirUsuarioAtivo(dados.length > 0 ? dados[0] : null);
      } else if (!usuarioAtivo && dados.length > 0) {
        definirUsuarioAtivo(dados[0]);
      }
    } catch {
      // API pode estar offline ou vazia
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function definirUsuarioAtivo(usuario) {
    setUsuarioAtivo(usuario);
    if (usuario) {
      localStorage.setItem("pafaze_usuario_ativo", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("pafaze_usuario_ativo");
    }
  }

  async function cadastrarUsuario({ nome, email, senha }) {
    const novoUsuario = await apiFetch("/api/usuarios", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    });
    setTodosUsuarios((prev) => [...prev, novoUsuario]);
    definirUsuarioAtivo(novoUsuario);
    return novoUsuario;
  }

  async function loginUsuario({ email, senha }) {
    const usuario = await apiFetch("/api/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
    definirUsuarioAtivo(usuario);
    return usuario;
  }

  function logout() {
    definirUsuarioAtivo(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuarioAtivo,
        todosUsuarios,
        carregando,
        definirUsuarioAtivo,
        cadastrarUsuario,
        loginUsuario,
        carregarUsuarios,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

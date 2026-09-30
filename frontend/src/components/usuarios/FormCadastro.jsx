export default function FormCadastro({
  modo = "cadastro",
  nome,
  setNome,
  email,
  setEmail,
  senha,
  setSenha,
  confirmaSenha,
  setConfirmaSenha,
  carregando,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="auth-form" noValidate>
      {modo === "cadastro" && (
        <div className="form-group">
          <label htmlFor="cadastro-nome">Nome Completo</label>
          <input
            id="cadastro-nome"
            type="text"
            className="form-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Gabriel Gomes"
            required
            disabled={carregando}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="cadastro-email">E-mail</label>
        <input
          id="cadastro-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.email@exemplo.com"
          required
          disabled={carregando}
        />
      </div>

      <div className={modo === "cadastro" ? "form-row" : "form-group"}>
        <div className="form-group">
          <label htmlFor="cadastro-senha">Senha</label>
          <input
            id="cadastro-senha"
            type="password"
            className="form-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder={modo === "cadastro" ? "Mínimo 6 caracteres" : "Digite sua senha"}
            required
            disabled={carregando}
          />
        </div>

        {modo === "cadastro" && (
          <div className="form-group">
            <label htmlFor="cadastro-confirma-senha">Confirmar Senha</label>
            <input
              id="cadastro-confirma-senha"
              type="password"
              className="form-input"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              placeholder="Repita a senha"
              required
              disabled={carregando}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        id="btn-cadastrar-usuario"
        className="btn btn-primary btn-block"
        disabled={carregando}
      >
        {carregando
          ? "Processando..."
          : modo === "cadastro"
          ? "Criar minha conta"
          : "Entrar na conta"}
      </button>
    </form>
  );
}

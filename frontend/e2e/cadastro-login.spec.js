import { expect, test } from "@playwright/test";

test("deve validar formulário, cadastrar novo usuário e realizar login com senha", async ({
  page,
}) => {
  const sufixo = Date.now();
  const nome = `Usuário E2E ${sufixo}`;
  const email = `e2e_${sufixo}@pafaze.com`;
  const senha = "SenhaSegura123";

  await page.goto("/");
  await page.getByRole("link", { name: "Cadastrar" }).click();
  await expect(page).toHaveURL(/\/cadastro$/);

  // Validação de senhas divergentes no formulário de cadastro
  await page.locator("#cadastro-nome").fill(nome);
  await page.locator("#cadastro-email").fill(email);
  await page.locator("#cadastro-senha").fill(senha);
  await page.locator("#cadastro-confirma-senha").fill("OutraSenha123");
  await page.locator("#btn-cadastrar-usuario").click();

  await expect(page.getByRole("alert")).toContainText("As senhas não coincidem.");

  // Cadastro válido com redirecionamento automático para /amigos
  await page.locator("#cadastro-confirma-senha").fill(senha);
  await page.locator("#btn-cadastrar-usuario").click();

  await expect(page.getByRole("alert")).toContainText("Conta criada com sucesso!");
  await expect(page).toHaveURL(/\/amigos$/, { timeout: 5000 });

  // Retorna para /cadastro e alterna para a aba de login com senha
  await page.getByRole("link", { name: "Cadastrar" }).click();
  await expect(page).toHaveURL(/\/cadastro$/);
  await page.getByRole("button", { name: "Entrar com Senha" }).click();

  // Tentativa de login com senha incorreta
  await page.locator("#cadastro-email").fill(email);
  await page.locator("#cadastro-senha").fill("SenhaErrada");
  await page.locator("#btn-cadastrar-usuario").click();
  await expect(page.getByRole("alert")).toContainText("E-mail ou senha incorretos.");

  // Login válido e confirmação da sessão ativa no localStorage
  await page.locator("#cadastro-senha").fill(senha);
  await page.locator("#btn-cadastrar-usuario").click();

  await expect(page.getByRole("alert")).toContainText("Login realizado com sucesso!");
  await expect(page).toHaveURL(/\/amigos$/, { timeout: 5000 });

  const usuarioSalvo = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("pafaze_usuario_ativo") || "null"),
  );
  expect(usuarioSalvo).not.toBeNull();
  expect(usuarioSalvo.email).toBe(email);
  expect(usuarioSalvo.nome).toBe(nome);
});

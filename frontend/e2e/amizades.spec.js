import { expect, test } from "@playwright/test";

test("deve enviar solicitação de amizade, alternar para o destinatário, aceitar e confirmar conexão", async ({
  page,
  request,
}) => {
  const sufixo = Date.now();
  const usuarioA = {
    nome: `Davi E2E ${sufixo}`,
    email: `davi_e2e_${sufixo}@pafaze.com`,
    senha: "SenhaSegura123",
  };
  const usuarioB = {
    nome: `Alice E2E ${sufixo}`,
    email: `alice_e2e_${sufixo}@pafaze.com`,
    senha: "SenhaSegura123",
  };

  // Cria os dois usuários via API para garantir dados determinísticos no teste
  const resA = await request.post("http://127.0.0.1:8000/api/usuarios", {
    data: usuarioA,
  });
  expect(resA.ok()).toBeTruthy();
  const dadosA = await resA.json();

  const resB = await request.post("http://127.0.0.1:8000/api/usuarios", {
    data: usuarioB,
  });
  expect(resB.ok()).toBeTruthy();
  const dadosB = await resB.json();

  // Define o Usuário A como perfil ativo inicial e acessa a página de Amigos
  await page.addInitScript((user) => {
    window.localStorage.setItem("pafaze_usuario_ativo", JSON.stringify(user));
  }, dadosA);

  await page.goto("/amigos");
  await expect(page.locator(".user-name")).toHaveText(usuarioA.nome);

  // Navega para a aba "Encontrar Amigos", busca pelo Usuário B e envia solicitação
  await page.getByRole("button", { name: /Encontrar Amigos/i }).click();
  await page
    .getByPlaceholder("Digite o nome ou e-mail de um usuário...")
    .fill(usuarioB.email);

  const cardUsuarioB = page.locator(".friend-card", { hasText: usuarioB.nome });
  await expect(cardUsuarioB).toBeVisible();
  await cardUsuarioB.getByRole("button", { name: /Adicionar Amigo/i }).click();

  await expect(page.getByRole("alert")).toContainText(
    `Pedido enviado para ${usuarioB.nome}!`,
  );

  // Alterna o perfil ativo no cabeçalho para o destinatário (Usuário B)
  await page
    .locator(".user-switch-select")
    .selectOption(String(dadosB.id));
  await expect(page.locator(".user-name")).toHaveText(usuarioB.nome);

  // Acessa a aba "Pedidos Pendentes" e aceita a solicitação do Usuário A
  const abaPedidos = page.getByRole("button", { name: /Pedidos Pendentes/i });
  await expect(abaPedidos).toContainText("1");
  await abaPedidos.click();

  const cardPedidoA = page.locator(".request-card", { hasText: usuarioA.nome });
  await expect(cardPedidoA).toBeVisible();
  await cardPedidoA.getByRole("button", { name: /Aceitar/i }).click();

  await expect(page.getByRole("alert")).toContainText(
    `Você e ${usuarioA.nome} agora são amigos!`,
  );

  // Confirma a amizade na aba "Meus Amigos"
  const abaMeusAmigos = page.getByRole("button", { name: /Meus Amigos/i });
  await expect(abaMeusAmigos).toContainText("Meus Amigos (1)");
  await abaMeusAmigos.click();

  const cardAmigoConectado = page.locator(".friend-card", {
    hasText: usuarioA.nome,
  });
  await expect(cardAmigoConectado).toBeVisible();
  await expect(cardAmigoConectado).toContainText("Amigo Conectado");
});

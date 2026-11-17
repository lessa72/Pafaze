import { expect, test } from "@playwright/test";

test("deve cadastrar uma receita com ingredientes, publicar e exibir na página de detalhes", async ({
  page,
}) => {
  const sufixo = Date.now();
  const nomeReceita = `Omelete Especial E2E ${sufixo}`;
  const categoria = "Jantar";
  const modoPreparo =
    "Bata os ovos com sal, misture o tomate picado e grelhe por 4 minutos.";
  const ingredientes = [
    { nome: "Ovo Caipira", quantidade: "3 unidades" },
    { nome: "Tomate Cereja", quantidade: "6 unidades" },
    { nome: "Orégano", quantidade: "1 pitada" },
  ];

  // Acessa a página inicial e navega para o formulário de publicação
  await page.goto("/");
  await page.getByRole("link", { name: "Publicar" }).click();

  await expect(page).toHaveURL(/\/receitas\/nova$/);
  await expect(
    page.getByRole("heading", { name: "Compartilhe sua receita" }),
  ).toBeVisible();

  // Preenche nome e categoria
  await page
    .getByPlaceholder("ex: Omelete de cebola e tomate")
    .fill(nomeReceita);
  await page.locator("form select").selectOption(categoria);

  // Adiciona uma terceira linha de ingrediente para validar o botão dinâmico
  await page
    .getByRole("button", { name: "+ Adicionar outro ingrediente" })
    .click();

  const nomesIngInputs = page.getByPlaceholder("Ingrediente (ex: Ovo)");
  const qtdsIngInputs = page.getByPlaceholder("Qtd (ex: 2 unidades)");
  await expect(nomesIngInputs).toHaveCount(3);

  for (let i = 0; i < ingredientes.length; i += 1) {
    await nomesIngInputs.nth(i).fill(ingredientes[i].nome);
    await qtdsIngInputs.nth(i).fill(ingredientes[i].quantidade);
  }

  // Preenche o modo de preparo e publica a receita
  await page
    .getByPlaceholder("Descreva o passo a passo...")
    .fill(modoPreparo);
  await page.getByRole("button", { name: "Publicar receita" }).click();

  // Verifica redirecionamento para a página de detalhes e exibição completa dos dados
  await expect(page).toHaveURL(/\/receitas\/\d+$/);
  await expect(page.getByRole("heading", { name: nomeReceita })).toBeVisible();
  await expect(page.locator(".meta").first()).toContainText(categoria);
  await expect(page.locator(".meta").first()).toContainText("0 avaliações");
  await expect(page.locator(".stars").first()).toContainText("★ 0");

  for (const ing of ingredientes) {
    await expect(
      page.locator(".pill", { hasText: `${ing.quantidade} ${ing.nome}` }),
    ).toBeVisible();
  }

  await expect(page.getByText(modoPreparo)).toBeVisible();

  // Recarrega a página para confirmar persistência no banco de dados
  await page.reload();
  await expect(page.getByRole("heading", { name: nomeReceita })).toBeVisible();
  for (const ing of ingredientes) {
    await expect(
      page.locator(".pill", { hasText: `${ing.quantidade} ${ing.nome}` }),
    ).toBeVisible();
  }
});


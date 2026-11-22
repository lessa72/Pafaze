import { expect, test } from "@playwright/test";

test("deve buscar receitas pelos ingredientes disponíveis e conferir ordem e faltantes", async ({
  page,
  request,
}) => {
  const sufixo = Date.now();
  const ingA = `farinha_${sufixo}`;
  const ingB = `ovo_${sufixo}`;
  const ingC = `leite_${sufixo}`;

  const receitaCompleta = `Bolo E2E ${sufixo}`;
  const receitaParcial = `Panqueca E2E ${sufixo}`;

  // Cria duas receitas com diferentes graus de compatibilidade
  await request.post("http://127.0.0.1:8000/api/receitas", {
    data: {
      nome: receitaCompleta,
      categoria: "Sobremesa",
      modo_preparo: "Misture e asse.",
      usuario_id: 1,
      ingredientes: [
        { nome: ingA, quantidade: "2 xícaras" },
        { nome: ingB, quantidade: "3 unidades" },
      ],
    },
  });

  await request.post("http://127.0.0.1:8000/api/receitas", {
    data: {
      nome: receitaParcial,
      categoria: "Lanches",
      modo_preparo: "Frite.",
      usuario_id: 1,
      ingredientes: [
        { nome: ingA, quantidade: "1 xícara" },
        { nome: ingB, quantidade: "2 unidades" },
        { nome: ingC, quantidade: "1 copo" },
      ],
    },
  });

  // Navega até a busca por ingredientes a partir da home
  await page.goto("/");
  await page.getByRole("link", { name: "Ingredientes" }).click();
  await expect(page).toHaveURL(/\/receitas\/ingredientes$/);

  const inputIngrediente = page.getByPlaceholder(
    "Digite um ingrediente e pressione Enter",
  );
  const btnBuscar = page.getByRole("button", { name: "Buscar receitas" });

  // Botão deve iniciar desabilitado quando não há ingredientes adicionados
  await expect(btnBuscar).toBeDisabled();

  // Adiciona ingredientes disponíveis
  await inputIngrediente.fill(ingA);
  await inputIngrediente.press("Enter");
  await inputIngrediente.fill(ingB);
  await inputIngrediente.press("Enter");

  // Adiciona e remove um ingrediente extra para testar a tag de exclusão
  await inputIngrediente.fill("extra");
  await inputIngrediente.press("Enter");
  await expect(page.locator(".ingrediente-tag", { hasText: "extra" })).toBeVisible();
  await page
    .locator(".ingrediente-tag", { hasText: "extra" })
    .getByRole("button")
    .click();
  await expect(page.locator(".ingrediente-tag", { hasText: "extra" })).not.toBeVisible();

  // Executa a busca
  await btnBuscar.click();

  // Valida ordenação: receita completa primeiro, depois receita parcial
  const cardCompleto = page.locator(".receita-card", { hasText: receitaCompleta });
  const cardParcial = page.locator(".receita-card", { hasText: receitaParcial });

  await expect(cardCompleto).toBeVisible();
  await expect(cardCompleto).toContainText("2 de 2 ingredientes disponíveis");
  await expect(cardCompleto).toContainText("Você tem todos os ingredientes!");

  await expect(cardParcial).toBeVisible();
  await expect(cardParcial).toContainText("2 de 3 ingredientes disponíveis");
  await expect(cardParcial).toContainText("Faltam 1 ingrediente(s).");
});

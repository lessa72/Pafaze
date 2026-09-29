import { apiFetch } from "./client";

export async function obterReceitas({
  nome = "",
  categoria = "",
  ordenarPor = "",
  ordem = "desc",
} = {}) {
  const params = new URLSearchParams();

  if (nome.trim()) params.append("nome", nome.trim());
  if (categoria.trim()) params.append("categoria", categoria.trim());
  if (ordenarPor.trim()) params.append("ordenar_por", ordenarPor.trim());
  if (ordem.trim()) params.append("ordem", ordem.trim());

  const queryString = params.toString();
  const endpoint = queryString ? `/api/receitas?${queryString}` : "/api/receitas";

  return apiFetch(endpoint);
}

export async function obterCategorias() {
  return apiFetch("/api/receitas/categorias");
}

const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let msg = `Erro ${response.status} ao acessar a API`;
    try {
      const err = await response.json();
      if (err?.detail) msg = err.detail;
    } catch {}
    throw new Error(msg);
  }

  return response.json();
}

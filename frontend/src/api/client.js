const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = `Erro ${response.status} ao acessar a API`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.detail) {
        errorDetail =
          typeof errorJson.detail === "string"
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
      }
    } catch {
      // response body was not json
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

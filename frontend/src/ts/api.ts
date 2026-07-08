// Cliente HTTP centralizado: envuelve fetch, agrega el token JWT
// automáticamente y normaliza los errores del backend.

const API_BASE_URL = "http://localhost:4000/api";

function getToken(): string | null {
  return localStorage.getItem("taskflow_token");
}

export function setToken(token: string): void {
  localStorage.setItem("taskflow_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("taskflow_token");
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data && (data as { message?: string }).message) ||
      "Ocurrió un error inesperado. Intenta de nuevo.";
    throw new Error(message);
  }

  return data as T;
}

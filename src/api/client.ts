import { getStoredToken } from '@/utils/auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function apiFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const qs = params?.toString();
  const url = qs ? `${API_URL}${path}?${qs}` : `${API_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message: string | undefined;
    try {
      const body = (await response.json()) as { message?: string };
      message = body.message;
    } catch {
      // Some proxy and multipart errors do not return JSON.
    }
    throw new Error(message ?? `API error: ${response.status} ${response.statusText}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function apiGetAuth<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: await authHeaders(),
    signal,
  });
  return parse<T>(response);
}

export async function apiPostAuth<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parse<T>(response);
}

export async function apiPutAuth<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parse<T>(response);
}

export async function apiUploadAuth<T>(
  path: string,
  formData: FormData,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: await authHeaders(),
    body: formData,
    signal,
  });
  return parse<T>(response);
}

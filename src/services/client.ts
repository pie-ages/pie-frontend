import { getStoredToken } from '@/utils/auth-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly serverMessage?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  { method = 'GET', body, auth = false, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (auth) {
    const token = await getStoredToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const isJson = body !== undefined && !(body instanceof FormData);
  if (isJson) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isJson ? JSON.stringify(body) : (body as FormData | undefined),
    signal,
  });
  return parse<T>(response);
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
    throw new ApiError(
      message ?? `API error: ${response.status} ${response.statusText}`,
      response.status,
      message,
    );
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function apiFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const qs = params?.toString();
  return request<T>(qs ? `${path}?${qs}` : path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body });
}

export function apiGetAuth<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { auth: true, signal });
}

export function apiPostAuth<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body, auth: true });
}

export function apiPutAuth<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body, auth: true });
}

export async function apiUploadAuth<T>(
  path: string,
  formData: FormData,
  signal?: AbortSignal,
): Promise<T> {
  const body = new FormData();
  for (const [name, part] of formData.entries()) {
    if (typeof part === 'object' && 'uri' in part && typeof part.uri === 'string') {
      const fileResponse = await fetch(part.uri, { signal });
      if (!fileResponse.ok) throw new Error('Não foi possível ler a foto selecionada.');
      const blob = await fileResponse.blob();
      body.append(name, blob.slice(0, blob.size, part.type || blob.type), part.name);
    } else {
      body.append(name, part);
    }
  }
  return request<T>(path, { method: 'POST', body, auth: true, signal });
}

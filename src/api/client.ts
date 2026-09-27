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

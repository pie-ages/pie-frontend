import type { LoginPayload, LoginResponse } from '@/shared/Login';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

type ErrorResponse = {
  message?: string;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  let data: Partial<LoginResponse> & ErrorResponse = {};

  try {
    data = (await response.json()) as Partial<LoginResponse> & ErrorResponse;
  } catch {
    // O status HTTP ainda permite tratar respostas sem corpo JSON.
  }

  if (!response.ok) {
    throw new AuthApiError(data.message ?? 'Não foi possível entrar.', response.status);
  }

  if (!data.token || !data.user) {
    throw new AuthApiError(
      'A API retornou uma resposta de autenticação inválida.',
      response.status,
    );
  }

  return data as LoginResponse;
}

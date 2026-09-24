import { isAxiosError } from 'axios';

import Api from '@/lib/api';
import type { LoginPayload, LoginResponse } from '@/types/Login';

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
  try {
    const { data } = await Api.post<LoginResponse>('/auth/login', payload);

    if (!data.token || !data.user) {
      throw new AuthApiError('A API retornou uma resposta de autenticação inválida.', 200);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthApiError) throw error;

    if (isAxiosError<ErrorResponse>(error) && error.response) {
      throw new AuthApiError(
        error.response.data?.message ?? 'Não foi possível entrar.',
        error.response.status,
      );
    }

    throw error;
  }
}

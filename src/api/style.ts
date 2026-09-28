import axios, { isAxiosError } from 'axios';

import { resolveIdentifiedStyles, type Style } from '@/types/Style';
import { getStoredToken } from '@/utils/auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
const ERROR_MESSAGE = 'Não foi possível identificar seu estilo. Tente novamente.';
type ErrorResponse = { message?: string };

export class StyleSessionError extends Error {}

export async function identifyStyle(): Promise<Style[]> {
  const token = await getStoredToken();
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.');

  try {
    const response = await axios.post<unknown>(
      `${API_URL}/api/users/me/style/identify`,
      undefined,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const styles =
      typeof response.data === 'object' && response.data !== null && 'styles' in response.data
        ? resolveIdentifiedStyles(response.data.styles)
        : null;

    if (!styles) throw new Error('A API retornou um estilo inválido. Tente novamente.');
    return styles;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 401 || (status === 404 && message?.startsWith('Usuário não encontrado'))) {
        throw new StyleSessionError('Sua sessão expirou. Entre novamente para continuar.');
      }
      throw new Error(message ?? ERROR_MESSAGE);
    }
    throw error;
  }
}

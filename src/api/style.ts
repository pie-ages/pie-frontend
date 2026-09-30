import axios, { isAxiosError } from 'axios';

import { resolveIdentifiedStyle, type IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { StyleQuizSubmission } from '@/types/StyleQuiz';
import { getStoredToken } from '@/utils/auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
const ERROR_MESSAGE = 'Não foi possível identificar seu estilo. Tente novamente.';
type ErrorResponse = { message?: string };

export class StyleSessionError extends Error {}

export async function submitStyleQuizAndIdentify(
  answers: StyleQuizSubmission[],
): Promise<IdentifiedStyle> {
  const token = await getStoredToken();
  if (!token) throw new StyleSessionError('Sua sessão expirou. Entre novamente para continuar.');

  try {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post(`${API_URL}/api/users/me/style/answers`, { answers }, { headers });
    const response = await axios.post<unknown>(
      `${API_URL}/api/users/me/style/identify`,
      undefined,
      { headers },
    );
    if (
      typeof response.data === 'object' &&
      response.data !== null &&
      'styles' in response.data &&
      Array.isArray(response.data.styles) &&
      response.data.styles.length === 0
    ) {
      throw new Error('Não há respostas ou preferências suficientes para identificar seu estilo.');
    }
    const style =
      typeof response.data === 'object' && response.data !== null && 'styles' in response.data
        ? resolveIdentifiedStyle(response.data.styles)
        : null;

    if (!style) throw new Error('A API retornou um estilo inválido. Tente novamente.');
    return style;
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

export async function getIdentifiedStyle(): Promise<IdentifiedStyle | null> {
  const token = await getStoredToken();
  if (!token) throw new StyleSessionError('Sua sessão expirou. Entre novamente para continuar.');

  try {
    const response = await axios.get<unknown>(`${API_URL}/api/users/me/style/identified`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (
      typeof response.data !== 'object' ||
      response.data === null ||
      !('styles' in response.data)
    ) {
      throw new Error('A API retornou um estilo inválido. Tente novamente.');
    }
    if (Array.isArray(response.data.styles) && response.data.styles.length === 0) return null;
    const style = resolveIdentifiedStyle(response.data.styles);
    if (!style) throw new Error('A API retornou um estilo inválido. Tente novamente.');
    return style;
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

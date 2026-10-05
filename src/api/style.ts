import { ApiError, apiFetch, apiGetAuth, apiPostAuth } from '@/api/client';
import { resolveIdentifiedStyle, type IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { StyleQuizQuestion, StyleQuizResponse, StyleQuizSubmission } from '@/types/StyleQuiz';

const ERROR_MESSAGE = 'Não foi possível identificar seu estilo. Tente novamente.';
const INVALID_STYLE_MESSAGE = 'A API retornou um estilo inválido. Tente novamente.';
const SESSION_MESSAGE = 'Sua sessão expirou. Entre novamente para continuar.';

export class StyleSessionError extends Error {}

function toStyleError(error: unknown): unknown {
  if (!(error instanceof ApiError)) return error;
  if (
    error.status === 401 ||
    (error.status === 404 && error.serverMessage?.startsWith('Usuário não encontrado'))
  ) {
    return new StyleSessionError(SESSION_MESSAGE);
  }
  return new Error(error.serverMessage ?? ERROR_MESSAGE);
}

function readStyles(data: unknown): unknown[] | null {
  if (typeof data !== 'object' || data === null || !('styles' in data)) return null;
  return Array.isArray(data.styles) ? data.styles : null;
}

export async function fetchStyleQuestions(): Promise<StyleQuizQuestion[]> {
  const data = await apiFetch<StyleQuizResponse>('/api/style/questions');
  return [...data.questions].sort((a, b) => a.order - b.order);
}

export async function submitStyleQuizAndIdentify(
  answers: StyleQuizSubmission[],
): Promise<IdentifiedStyle> {
  let data: unknown;
  try {
    await apiPostAuth('/api/users/me/style/answers', { answers });
    data = await apiPostAuth<unknown>('/api/users/me/style/identify');
  } catch (error) {
    throw toStyleError(error);
  }

  const styles = readStyles(data);
  if (styles?.length === 0) {
    throw new Error('Não há respostas ou preferências suficientes para identificar seu estilo.');
  }
  const style = resolveIdentifiedStyle(styles);
  if (!style) throw new Error(INVALID_STYLE_MESSAGE);
  return style;
}

export async function getIdentifiedStyle(): Promise<IdentifiedStyle | null> {
  let data: unknown;
  try {
    data = await apiGetAuth<unknown>('/api/users/me/style/identified');
  } catch (error) {
    throw toStyleError(error);
  }

  const styles = readStyles(data);
  if (styles?.length === 0) return null;
  const style = resolveIdentifiedStyle(styles);
  if (!style) throw new Error(INVALID_STYLE_MESSAGE);
  return style;
}

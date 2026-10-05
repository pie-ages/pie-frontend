import {
  styleIdentificationSchema,
  styleQuizResponseSchema,
  type StyleQuizQuestion,
} from '@/schemas/styleSchema';
import { ApiError, apiFetch, apiGetAuth, apiPostAuth, parseResponse } from '@/services/client';
import type { IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { StyleQuizSubmission } from '@/types/StyleQuiz';

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

function readStyles(data: unknown): IdentifiedStyle[] {
  return parseResponse(styleIdentificationSchema, data, INVALID_STYLE_MESSAGE).styles;
}

export async function fetchStyleQuestions(): Promise<StyleQuizQuestion[]> {
  const data = parseResponse(styleQuizResponseSchema, await apiFetch('/api/style/questions'));
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

  const [style] = readStyles(data);
  if (!style) {
    throw new Error('Não há respostas ou preferências suficientes para identificar seu estilo.');
  }
  return style;
}

export async function getIdentifiedStyle(): Promise<IdentifiedStyle | null> {
  let data: unknown;
  try {
    data = await apiGetAuth<unknown>('/api/users/me/style/identified');
  } catch (error) {
    throw toStyleError(error);
  }

  return readStyles(data)[0] ?? null;
}

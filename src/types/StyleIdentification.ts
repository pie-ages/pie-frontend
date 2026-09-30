import type { IdentifiedStyle } from './IdentifiedStyle';
import type { StyleQuizSubmission } from './StyleQuiz';

export type StyleIdentificationState =
  | { status: 'idle'; error: null }
  | { status: 'loading'; error: null }
  | { status: 'error'; error: string };

export type StyleIdentificationAction =
  { type: 'start' } | { type: 'success' } | { type: 'error'; error: string };

export const INITIAL_STYLE_IDENTIFICATION_STATE: StyleIdentificationState = {
  status: 'idle',
  error: null,
};

export function styleIdentificationReducer(
  _state: StyleIdentificationState,
  action: StyleIdentificationAction,
): StyleIdentificationState {
  if (action.type === 'start') return { status: 'loading', error: null };
  if (action.type === 'error') return { status: 'error', error: action.error };
  return INITIAL_STYLE_IDENTIFICATION_STATE;
}

type Identify = (answers: StyleQuizSubmission[]) => Promise<IdentifiedStyle>;

export function createStyleIdentificationRunner(identify: Identify) {
  let pending: Promise<IdentifiedStyle> | null = null;

  return (answers: StyleQuizSubmission[]) => {
    if (pending) return { started: false, promise: pending };

    pending = identify(answers).finally(() => {
      pending = null;
    });
    return { started: true, promise: pending };
  };
}

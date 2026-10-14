import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { CurrentUser } from '@/schemas/userSchema';
import { isSessionExpiredError } from '@/services/client';
import { fetchPreferences } from '@/services/preferences';
import { getFavoriteStyles, StyleSessionError } from '@/services/style';
import { fetchCurrentUser } from '@/services/user';
import type { IdentifiedStyle } from '@/types/IdentifiedStyle';

export type ProfileSectionStatus = 'loading' | 'success' | 'error' | 'empty';

export type ProfileSection<T> = {
  status: ProfileSectionStatus;
  data: T | null;
  retry: () => void;
};

type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error' }
  | { status: 'session' };

function isSessionError(error: unknown) {
  return error instanceof StyleSessionError || isSessionExpiredError(error);
}

function useProfileResource<T>(fetcher: (signal: AbortSignal) => Promise<T>, enabled: boolean) {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: isSessionError(error) ? 'session' : 'error' });
        }
      });

    return () => controller.abort();
  }, [attempt, enabled, fetcher]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }, []);

  const reset = useCallback(() => setState({ status: 'loading' }), []);

  return { state, retry, reset };
}

function toSection<T, R>(
  resource: { state: ResourceState<T>; retry: () => void },
  select: (data: T) => R,
  isEmpty?: (value: R) => boolean,
): ProfileSection<R> {
  const { state, retry } = resource;
  if (state.status === 'success') {
    const data = select(state.data);
    return { status: isEmpty?.(data) ? 'empty' : 'success', data, retry };
  }
  // 'session' segue como loading enquanto o usuário é redirecionado para o login.
  return { status: state.status === 'error' ? 'error' : 'loading', data: null, retry };
}

const isEmptyList = (list: unknown[]) => list.length === 0;

export function useProfile(enabled: boolean) {
  const { signOut } = useAuth();
  const sessionHandled = useRef(false);

  const userResource = useProfileResource(fetchCurrentUser, enabled);
  const preferencesResource = useProfileResource(fetchPreferences, enabled);
  const stylesResource = useProfileResource(getFavoriteStyles, enabled);

  const sessionExpired = [userResource, preferencesResource, stylesResource].some(
    (resource) => resource.state.status === 'session',
  );

  useEffect(() => {
    if (!sessionExpired || sessionHandled.current) return;
    sessionHandled.current = true;
    signOut().finally(() => router.replace('/Login'));
  }, [sessionExpired, signOut]);

  const { reset: resetUser } = userResource;
  const { reset: resetPreferences } = preferencesResource;
  const { reset: resetStyles } = stylesResource;

  const reset = useCallback(() => {
    sessionHandled.current = false;
    resetUser();
    resetPreferences();
    resetStyles();
  }, [resetUser, resetPreferences, resetStyles]);

  return {
    user: toSection<CurrentUser, CurrentUser>(userResource, (user) => user),
    colorimetry: toSection(preferencesResource, (p) => p.highlightColors, isEmptyList),
    favoriteColors: toSection(preferencesResource, (p) => p.favoriteColors, isEmptyList),
    styles: toSection<IdentifiedStyle[], IdentifiedStyle[]>(
      stylesResource,
      (styles) => styles,
      isEmptyList,
    ),
    reset,
  };
}

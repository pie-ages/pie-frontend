import { useCallback, useEffect, useState } from 'react';

import { getFavoriteStyles, StyleSessionError } from '@/services/style';
import type { IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { ProfileStatus } from '@/types/Profile';

export function useFavoriteStyles(enabled: boolean) {
  const [favoriteStyles, setFavoriteStyles] = useState<IdentifiedStyle[]>([]);
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    getFavoriteStyles(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setFavoriteStyles(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof StyleSessionError) setSessionExpired(true);
        else setStatus('error');
      });

    return () => {
      controller.abort();
      setStatus('loading');
      setSessionExpired(false);
    };
  }, [attempt, enabled]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return { favoriteStyles, status, sessionExpired, retry };
}

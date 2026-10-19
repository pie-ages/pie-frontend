import { useCallback, useEffect, useState } from 'react';

import { getFavoriteStyles, StyleSessionError } from '@/services/style';
import type { IdentifiedStyle } from '@/types/IdentifiedStyle';
import { ProfileStatus } from '@/types/Profile';

export function useFavoriteStyles(enabled: boolean) {
  const [favoriteStyles, setFavoriteStyles] = useState<IdentifiedStyle[]>([]);
  const [status, setStatus] = useState<ProfileStatus>(ProfileStatus.Loading);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    getFavoriteStyles(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setFavoriteStyles(data);
        setStatus(data.length === 0 ? ProfileStatus.Empty : ProfileStatus.Success);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof StyleSessionError) setSessionExpired(true);
        else setStatus(ProfileStatus.Error);
      });

    return () => {
      controller.abort();
      setStatus(ProfileStatus.Loading);
      setSessionExpired(false);
    };
  }, [attempt, enabled]);

  const retry = useCallback(() => {
    setStatus(ProfileStatus.Loading);
    setAttempt((value) => value + 1);
  }, []);

  return { favoriteStyles, status, sessionExpired, retry };
}

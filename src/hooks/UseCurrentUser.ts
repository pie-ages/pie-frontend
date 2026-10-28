import { useCallback, useEffect, useState } from 'react';

import type { CurrentUser } from '@/schemas/userSchema';
import { isSessionExpiredError } from '@/services/client';
import { fetchCurrentUser } from '@/services/user';
import { ProfileStatus } from '@/types/Profile';

export function useCurrentUser(enabled: boolean) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<ProfileStatus>(ProfileStatus.Loading);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    fetchCurrentUser(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setUser(data);
        setStatus(ProfileStatus.Success);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (isSessionExpiredError(error)) setSessionExpired(true);
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

  return { user, status, sessionExpired, retry };
}

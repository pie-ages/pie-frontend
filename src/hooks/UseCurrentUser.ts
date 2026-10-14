import { useCallback, useEffect, useState } from 'react';

import type { CurrentUser } from '@/schemas/userSchema';
import { isSessionExpiredError } from '@/services/client';
import { fetchCurrentUser } from '@/services/user';
import type { ProfileStatus } from '@/types/Profile';

export function useCurrentUser(enabled: boolean) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    fetchCurrentUser(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setUser(data);
        setStatus('success');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (isSessionExpiredError(error)) setSessionExpired(true);
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

  return { user, status, sessionExpired, retry };
}

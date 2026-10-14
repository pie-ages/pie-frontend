import { useCallback, useEffect, useState } from 'react';

import type { ColorimetryPreferences } from '@/schemas/colorimetrySchema';
import { isSessionExpiredError } from '@/services/client';
import { fetchPreferences } from '@/services/preferences';
import type { ProfileStatus } from '@/types/Profile';

export function useProfilePreferences(enabled: boolean) {
  const [preferences, setPreferences] = useState<ColorimetryPreferences | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    fetchPreferences(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setPreferences(data);
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

  return {
    highlightColors: preferences?.highlightColors ?? [],
    favoriteColors: preferences?.favoriteColors ?? [],
    status,
    sessionExpired,
    retry,
  };
}

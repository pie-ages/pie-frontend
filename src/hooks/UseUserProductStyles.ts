import { useCallback, useEffect, useState } from 'react';

import { fetchUserProductStyles } from '@/services/profile';
import type { Style } from '@/types/Style';

export type UserProductStylesStatus = 'loading' | 'success' | 'error';

export function useUserProductStyles() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [status, setStatus] = useState<UserProductStylesStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchUserProductStyles()
      .then((data) => {
        if (!isActive) return;
        setStyles(data);
        setStatus('success');
      })
      .catch(() => {
        if (isActive) setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return { styles, status, retry };
}

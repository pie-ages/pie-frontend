import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { MOCK_LOOKS } from '@/mocks/looks';
import type { Look } from '@/types/look';

export type LooksStatus = 'loading' | 'success' | 'error' | 'empty';

const FORCEABLE_STATUSES = ['loading', 'error', 'empty'];
type ForceableStatus = (typeof FORCEABLE_STATUSES)[number];

function resolveForcedStatus(value: string | string[] | undefined): ForceableStatus | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (FORCEABLE_STATUSES as readonly string[]).includes(normalized ?? '')
    ? (normalized as ForceableStatus)
    : null;
}

function fetchMockLooks(forcedStatus: ForceableStatus | null): Promise<Look[]> {
  return new Promise((resolve, reject) => {
    if (forcedStatus === 'loading') {
      return;
    }

    setTimeout(() => {
      if (forcedStatus === 'error') {
        reject(new Error('Não foi possível carregar os looks.'));
        return;
      }

      resolve(forcedStatus === 'empty' ? [] : MOCK_LOOKS);
    }, 600);
  });
}

export function useLooksCollection() {
  const { status: statusParam } = useLocalSearchParams<{ status?: string }>();
  const forcedStatus = resolveForcedStatus(statusParam);

  const [status, setStatus] = useState<LooksStatus>('loading');
  const [looks, setLooks] = useState<Look[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchMockLooks(forcedStatus)
      .then((result) => {
        if (!isActive) return;
        setLooks(result);
        setStatus(result.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (!isActive) return;
        setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [forcedStatus, attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return { status, looks, retry };
}

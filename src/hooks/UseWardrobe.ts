import { useCallback, useEffect, useState } from 'react';

import { fetchWardrobeItems } from '@/services/wardrobe';
import type { WardrobePiece } from '@/types/Look';

type WardrobeStatus = 'loading' | 'success' | 'error' | 'empty';

export function useWardrobe() {
  const [pieces, setPieces] = useState<WardrobePiece[]>([]);
  const [status, setStatus] = useState<WardrobeStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchWardrobeItems()
      .then((result) => {
        if (!isActive) return;
        setPieces(result);
        setStatus(result.length === 0 ? 'empty' : 'success');
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

  return { pieces, status, retry };
}

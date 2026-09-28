import { isCancel } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchLooks } from '@/api/looks';
import { appendLookPage, type Look } from '@/types/look';

export type LooksStatus = 'loading' | 'success' | 'error' | 'empty';

export function useLooksCollection() {
  const [status, setStatus] = useState<LooksStatus>('loading');
  const [looks, setLooks] = useState<Look[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    inFlight.current = true;
    fetchLooks(0, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        inFlight.current = false;
        setLooks(result.items);
        setPage(result.page);
        setHasNext(result.hasNext);
        setPageError(false);
        setStatus(result.items.length === 0 ? 'empty' : 'success');
      })
      .catch((error) => {
        if (!controller.signal.aborted && !isCancel(error)) {
          inFlight.current = false;
          setStatus('error');
        }
      })
      .finally(() => {
        if (controllerRef.current === controller) inFlight.current = false;
      });

    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
      inFlight.current = false;
    };
  }, [attempt]);

  const loadMore = useCallback(
    async (retryPage = false) => {
      if (status !== 'success' || !hasNext || inFlight.current || (pageError && !retryPage)) return;
      inFlight.current = true;
      setLoadingMore(true);
      setPageError(false);
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const result = await fetchLooks(page + 1, controller.signal);
        if (controller.signal.aborted) return;
        setLooks((previous) => appendLookPage(previous, result.items));
        setPage(result.page);
        setHasNext(result.hasNext);
      } catch (error) {
        if (!controller.signal.aborted && !isCancel(error)) setPageError(true);
      } finally {
        if (controllerRef.current === controller) {
          inFlight.current = false;
          setLoadingMore(false);
        }
      }
    },
    [hasNext, page, pageError, status],
  );

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);

  return { status, looks, retry, hasNext, loadingMore, pageError, loadMore };
}

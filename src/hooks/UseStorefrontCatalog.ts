import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchCatalog } from '@/api/products';
import type { CatalogItem, CatalogParams } from '@/types/Product';

export type StorefrontStatus = 'loading' | 'success' | 'error' | 'empty';

const FORCEABLE_STATUSES = ['loading', 'error', 'empty'] as const;
type ForceableStatus = (typeof FORCEABLE_STATUSES)[number];

function resolveForcedStatus(value: string | string[] | undefined): ForceableStatus | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (FORCEABLE_STATUSES as readonly string[]).includes(normalized ?? '')
    ? (normalized as ForceableStatus)
    : null;
}

function makeParamsKey(params: CatalogParams): string {
  return [
    params.search ?? '',
    [...(params.styles ?? [])].sort().join(','),
    [...(params.categories ?? [])].sort().join(','),
    [...(params.colors ?? [])].sort().join(','),
    [...(params.companies ?? [])].sort().join(','),
  ].join('|');
}

export function useStorefrontCatalog(params: CatalogParams = {}) {
  const { status: statusParam } = useLocalSearchParams<{ status?: string }>();
  const forcedStatus = resolveForcedStatus(statusParam);

  const [status, setStatus] = useState<StorefrontStatus>('loading');
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [attempt, setAttempt] = useState(0);

  const latestParams = useRef(params);
  // eslint-disable-next-line react-hooks/refs
  latestParams.current = params;

  const paramsKey = makeParamsKey(params);

  useEffect(() => {
    if (forcedStatus !== null) {
      if (forcedStatus !== 'loading') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProducts([]);

        setStatus(forcedStatus);
      }
      return;
    }

    let isActive = true;
    setStatus('loading');

    fetchCatalog(latestParams.current)
      .then((page) => {
        if (!isActive) return;
        setProducts(page.items);
        setStatus(page.items.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (!isActive) return;
        setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [forcedStatus, attempt, paramsKey]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((v) => v + 1);
  }, []);

  return { status, products, retry };
}

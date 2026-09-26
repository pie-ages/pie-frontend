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
    [...(params.materials ?? [])].sort().join(','),
    params.size ?? 20,
    params.sort ?? 'name,ASC',
  ].join('|');
}

export function useStorefrontCatalog(params: CatalogParams = {}) {
  const { status: statusParam } = useLocalSearchParams<{ status?: string }>();
  const forcedStatus = resolveForcedStatus(statusParam);

  const [status, setStatus] = useState<StorefrontStatus>('loading');
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const isFetching = useRef(false);
  // Incremented on every initial load reset; stale callbacks compare against it before mutating state.
  const generation = useRef(0);
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
    generation.current += 1;
    const gen = generation.current;
    isFetching.current = true;
    setStatus('loading');
    setProducts([]);
    setCurrentPage(0);
    setHasNextPage(false);

    fetchCatalog({ ...latestParams.current, page: 0 })
      .then((page) => {
        if (!isActive || generation.current !== gen) return;
        setProducts(page.items);
        setHasNextPage((page.page + 1) * page.size < page.total);
        setCurrentPage(0);
        setStatus(page.items.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (!isActive || generation.current !== gen) return;
        setStatus('error');
      })
      .finally(() => {
        if (isActive && generation.current === gen) isFetching.current = false;
      });

    return () => {
      isActive = false;
    };
  }, [forcedStatus, paramsKey, attempt]);

  const loadNextPage = useCallback(() => {
    if (isFetching.current || !hasNextPage) return;

    const nextPage = currentPage + 1;
    const gen = generation.current;
    isFetching.current = true;
    setIsFetchingNextPage(true);

    fetchCatalog({ ...latestParams.current, page: nextPage })
      .then((page) => {
        if (generation.current !== gen) return;
        setProducts((prev) => [...prev, ...page.items]);
        setHasNextPage((page.page + 1) * page.size < page.total);
        setCurrentPage(nextPage);
      })
      .catch(() => {
        // existing products are preserved on pagination error
      })
      .finally(() => {
        if (generation.current === gen) {
          isFetching.current = false;
          setIsFetchingNextPage(false);
        }
      });
  }, [hasNextPage, currentPage]);

  const refresh = useCallback(() => {
    if (isFetching.current) return;

    const gen = generation.current;
    isFetching.current = true;
    setRefreshing(true);

    fetchCatalog({ ...latestParams.current, page: 0 })
      .then((page) => {
        if (generation.current !== gen) return;
        setProducts(page.items);
        setHasNextPage((page.page + 1) * page.size < page.total);
        setCurrentPage(0);
        setStatus(page.items.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (generation.current !== gen) return;
        setStatus((prev) => (prev === 'success' ? 'success' : 'error'));
      })
      .finally(() => {
        if (generation.current === gen) {
          isFetching.current = false;
          setRefreshing(false);
        }
      });
  }, []);

  const retry = useCallback(() => {
    setAttempt((v) => v + 1);
  }, []);

  return { status, products, retry, loadNextPage, isFetchingNextPage, refresh, refreshing };
}

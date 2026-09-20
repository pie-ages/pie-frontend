import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchCatalog, type CatalogItem, type CatalogParams } from '@/api/products';
import type { Product } from '@/types/product';

export type StorefrontStatus = 'loading' | 'success' | 'error' | 'empty';

const FORCEABLE_STATUSES = ['loading', 'error', 'empty'] as const;
type ForceableStatus = (typeof FORCEABLE_STATUSES)[number];

function resolveForcedStatus(value: string | string[] | undefined): ForceableStatus | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (FORCEABLE_STATUSES as readonly string[]).includes(normalized ?? '')
    ? (normalized as ForceableStatus)
    : null;
}

function mapCatalogItem(item: CatalogItem): Product {
  return {
    id: item.id,
    name: item.name,
    color: item.color ?? undefined,
    style: item.styles[0] ?? undefined,
    category: item.category ?? undefined,
    price: item.price,
    description: '',
    sizes: item.sizes.map((s) => ({ label: s, available: true })),
    imageUrl: item.imageUrl,
    images: item.imageUrl ? [item.imageUrl] : [],
    purchaseUrl: item.purchaseUrl,
    store: { name: item.companyName ?? '', logoUrl: '' },
    storeName: item.companyName ?? '',
    isAvailable: item.status === 'PUBLISHED',
  };
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
  const [products, setProducts] = useState<Product[]>([]);
  const [attempt, setAttempt] = useState(0);

  const latestParams = useRef(params);
  // eslint-disable-next-line react-hooks/refs
  latestParams.current = params;

  // Stable string key so the effect re-runs only when params values actually change
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
        const mapped = page.items.map(mapCatalogItem);
        setProducts(mapped);
        setStatus(mapped.length === 0 ? 'empty' : 'success');
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

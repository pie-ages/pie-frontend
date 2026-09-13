import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { MOCK_PRODUCTS } from '@/mocks/products';
import type { Product } from '@/types/Product';

export type StorefrontStatus = 'loading' | 'success' | 'error' | 'empty';

const FORCEABLE_STATUSES = ['loading', 'error', 'empty'] as const;
type ForceableStatus = (typeof FORCEABLE_STATUSES)[number];

function resolveForcedStatus(value: string | string[] | undefined): ForceableStatus | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (FORCEABLE_STATUSES as readonly string[]).includes(normalized ?? '')
    ? (normalized as ForceableStatus)
    : null;
}

function fetchMockProducts(forcedStatus: ForceableStatus | null): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    if (forcedStatus === 'loading') {
      return;
    }

    setTimeout(() => {
      if (forcedStatus === 'error') {
        reject(new Error('NÃ£o foi possÃ­vel carregar a storefront.'));
        return;
      }

      resolve(forcedStatus === 'empty' ? [] : MOCK_PRODUCTS);
    }, 600);
  });
}

export function useStorefrontCatalog() {
  const { status: statusParam } = useLocalSearchParams<{ status?: string }>();
  const forcedStatus = resolveForcedStatus(statusParam);

  const [status, setStatus] = useState<StorefrontStatus>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetchMockProducts(forcedStatus)
      .then((result) => {
        if (!isActive) return;
        setProducts(result);
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

  return { status, products, retry };
}

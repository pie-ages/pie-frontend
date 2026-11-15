import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchWardrobeProductIds } from '@/services/wardrobe';

const NO_PRODUCTS: ReadonlySet<string> = new Set();

export function useWardrobeProductIds(): ReadonlySet<string> {
  const [productIds, setProductIds] = useState<ReadonlySet<string>>(NO_PRODUCTS);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      fetchWardrobeProductIds(controller.signal)
        .then((ids) => {
          if (!controller.signal.aborted) setProductIds(ids);
        })
        .catch(() => {});

      return () => controller.abort();
    }, []),
  );

  return productIds;
}

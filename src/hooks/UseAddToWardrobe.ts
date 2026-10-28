import { useCallback, useEffect, useRef, useState } from 'react';

import type { ProductPublicDetail } from '@/schemas/productSchema';
import { ApiError } from '@/services/client';
import { addProductToWardrobe, fetchWardrobeProductIds } from '@/services/wardrobe';
import { MissingProductImageError } from '@/utils/wardrobe-product';

type AddToWardrobeStatus = 'checking' | 'idle' | 'adding' | 'added';

const DEFAULT_ERROR = 'Não foi possível adicionar a peça ao closet. Tente novamente.';

export function useAddToWardrobe(product: ProductPublicDetail | null) {
  const [status, setStatus] = useState<AddToWardrobeStatus>('checking');
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const productId = product?.id;

  useEffect(() => {
    if (!productId) return;

    const id = productId;
    const controller = new AbortController();

    async function checkWardrobe() {
      setStatus('checking');
      setError(null);

      try {
        const productIds = await fetchWardrobeProductIds(controller.signal);
        if (!controller.signal.aborted) setStatus(productIds.has(id) ? 'added' : 'idle');
      } catch {
        if (!controller.signal.aborted) setStatus('idle');
      }
    }

    void checkWardrobe();

    return () => controller.abort();
  }, [productId]);

  const add = useCallback(async (): Promise<boolean> => {
    if (!product || busyRef.current || status !== 'idle') return false;

    busyRef.current = true;
    setStatus('adding');
    setError(null);

    try {
      await addProductToWardrobe(product);
      setStatus('added');
      return true;
    } catch (requestError) {
      setStatus('idle');
      setError(
        requestError instanceof ApiError || requestError instanceof MissingProductImageError
          ? requestError.message
          : DEFAULT_ERROR,
      );
      return false;
    } finally {
      busyRef.current = false;
    }
  }, [product, status]);

  return {
    isChecking: status === 'checking',
    isAdding: status === 'adding',
    isInWardrobe: status === 'added',
    error,
    add,
  };
}

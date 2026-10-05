import { useEffect, useState } from 'react';

import { fetchProductDetail } from '@/api/products';
import type { ProductPublicDetail } from '@/types/Product';

export function useProductDetails(id: string | undefined) {
  const [product, setProduct] = useState<ProductPublicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      if (!id) {
        setIsLoading(false);
        setError('Não foi possível carregar este produto.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setProduct(null);

      try {
        const detail = await fetchProductDetail(id);
        if (!isActive) return;
        setProduct(detail);
      } catch {
        if (isActive) {
          setError('Não foi possível carregar este produto.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  return { product, isLoading, error };
}

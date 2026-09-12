import { useEffect, useState } from 'react';

import { MOCK_PRODUCTS } from '../mocks/products';
import type { Product } from '../types/product';

export function useProductDetails(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      setProduct(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 700));

        if (!isActive) return;

        const found = id ? MOCK_PRODUCTS.find((p) => p.id === id) : undefined;

        if (!found) {
          setError('Não foi possível carregar este produto.');
          return;
        }

        setProduct(found);
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

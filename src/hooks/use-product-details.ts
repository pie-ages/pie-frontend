import { useEffect, useState } from 'react';

import { fetchProductDetail } from '@/api/products';

import type { Product } from '../types/product';

export function useProductDetails(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
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

        setProduct({
          id: detail.id,
          name: detail.name,
          description: detail.description ?? '',
          category: detail.category ?? undefined,
          color: detail.color ?? undefined,
          style: detail.styles[0] ?? undefined,
          price: detail.price,
          imageUrl: detail.imageUrl,
          images: detail.imageUrl ? [detail.imageUrl] : [],
          purchaseUrl: detail.purchaseUrl,
          store: { name: detail.companyName ?? '', logoUrl: '' },
          storeName: detail.companyName ?? '',
          isAvailable: detail.available,
          sizes: detail.sizes.map((s) => ({ label: s, available: true })),
        });
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

import { useEffect, useState } from 'react';

import type { Product } from '@/features/auth/types/product';

const MOCK_PRODUCTS: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Vestido Verde',
    images: [
      require('@/assets/images/mock-vestido-verde.png'),
      require('@/assets/images/mock-vestido-verde.png'),
    ],
    description: 'Vestido Midi com frente única e tiras em X nas costas com aviamento verde.',
    sizes: [
      { label: 'P', available: true },
      { label: 'M', available: true },
      { label: 'G', available: false },
      { label: 'GG', available: true },
    ],
    price: 199,
    storeName: 'Lojas Renner',
    purchaseUrl: 'https://www.lojasrenner.com.br',
    isAvailable: true,
  },
  '2': {
    id: '2',
    name: 'Jaqueta Jeans',
    images: ['https://picsum.photos/seed/jaqueta-jeans-1/600/800'],
    description: 'Jaqueta jeans oversized com botões frontais.',
    sizes: [
      { label: 'P', available: true },
      { label: 'M', available: false },
      { label: 'G', available: false },
      { label: 'GG', available: false },
    ],
    price: 259.9,
    storeName: 'C&A',
    purchaseUrl: 'https://www.cea.com.br',
    isAvailable: false,
  },
};

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

        const found = id ? MOCK_PRODUCTS[id] : undefined;

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

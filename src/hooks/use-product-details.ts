import { useEffect, useState } from 'react';

import { MOCK_PRODUCTS } from '@/mocks/products';
import type { ProductPublicDetail } from '@/types/Product';

export function useProductDetails(id: string | undefined) {
  const [product, setProduct] = useState<ProductPublicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TEMPORARY MOCK FOR UI TESTING
    setIsLoading(true);
    
    setTimeout(() => {
      const baseProduct = MOCK_PRODUCTS[0]; // Camisa listrada
      
      const mockDetail: ProductPublicDetail = {
        id: id || '1',
        name: baseProduct.name,
        description: 'Descrição de teste para validar a UI do aplicativo. Esta é uma camisa muito bonita e confortável.',
        category: baseProduct.category,
        color: baseProduct.color,
        price: baseProduct.price,
        imageUrl: baseProduct.imageUrl,
        purchaseUrl: baseProduct.purchaseUrl,
        companyName: baseProduct.companyName,
        styles: baseProduct.styles,
        sizes: baseProduct.sizes, // ['P', 'M', 'G', 'GG']
        materials: baseProduct.materials,
        available: true,
        inWishlist: false,
        images: [
          { id: 'img1', url: baseProduct.imageUrl || '', isPrimary: true, displayOrder: 1 },
          { id: 'img2', url: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400&q=80&auto=format', isPrimary: false, displayOrder: 2 },
          { id: 'img3', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80&auto=format', isPrimary: false, displayOrder: 3 }
        ]
      };
      
      setProduct(mockDetail);
      setIsLoading(false);
    }, 500);
  }, [id]);

  return { product, isLoading, error };
}

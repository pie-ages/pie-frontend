import type { Product } from '@/features/auth/types/product';

export const MOCK_PRODUCTS: Record<string, Product> = {
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

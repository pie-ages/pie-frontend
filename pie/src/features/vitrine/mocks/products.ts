import type { FilterOption, Product } from '@/features/vitrine/types/product';

/**
 * Dados mockados usados para montar o layout da vitrine sem depender do
 * backend. A integração real com a API de listagem acontece na task
 * PIE-45 (Integrar vitrine com a API de listagem e scroll infinito).
 */
export const MOCK_FILTERS: FilterOption[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'romantico', label: 'Romântico' },
  { id: 'criativo', label: 'Criativo' },
  { id: 'casual', label: 'Casual' },
  { id: 'classico', label: 'Clássico' },
  { id: 'minimalista', label: 'Minimalista' },
  { id: 'elegante', label: 'Elegante' },
];

const LOJA_PIE: Product['store'] = {
  name: 'Loja Piê',
  logoUrl: 'https://placehold.co/64x64/6E263D/FFFFFF.png?text=P',
};

const LOJA_VERDE: Product['store'] = {
  name: 'Verde Studio',
  logoUrl: 'https://placehold.co/64x64/2F6E4E/FFFFFF.png?text=V',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul',
    store: LOJA_PIE,
  },
  {
    id: '2',
    name: 'Vestido Verde',
    price: 199.0,
    imageUrl: 'https://picsum.photos/seed/pie-vestido-verde/400/500',
    purchaseUrl: 'https://example.com/produtos/vestido-verde',
    store: LOJA_VERDE,
  },
  {
    id: '3',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul-2/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-2',
    store: LOJA_PIE,
  },
  {
    id: '4',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul-3/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-3',
    store: LOJA_PIE,
  },
  {
    id: '5',
    name: 'Conjunto alfaiataria blazer e calça off-white para eventos',
    price: 459.5,
    imageUrl: null,
    purchaseUrl: 'https://example.com/produtos/conjunto-alfaiataria',
    store: LOJA_VERDE,
  },
  {
    id: '6',
    name: 'Bolsa de couro',
    price: 349.0,
    imageUrl: 'https://picsum.photos/seed/pie-bolsa-couro/400/500',
    purchaseUrl: 'https://example.com/produtos/bolsa-couro',
    store: LOJA_PIE,
  },
];

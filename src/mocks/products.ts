import type { FilterOption, Product } from '../types/product';

const SIZES_VESTUARIO = [
  { label: 'P', available: true },
  { label: 'M', available: true },
  { label: 'G', available: true },
  { label: 'GG', available: false },
];

const SIZES_UNICO = [{ label: 'Único', available: true }];

/**
 * Dados mockados usados para montar o layout da storefront sem depender do
 * backend. A integraÃ§Ã£o real com a API de listagem acontece na task
 * PIE-45 (Integrar storefront com a API de listagem e scroll infinito).
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
  name: 'Loja Pie',
  logoUrl: 'https://placehold.co/64x64/6E263D/FFFFFF.png?text=P',
};

const LOJA_VERDE: Product['store'] = {
  name: 'Verde Studio',
  logoUrl: 'https://placehold.co/64x64/2F6E4E/FFFFFF.png?text=V',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camisa listrada',
    color: 'Azul e branco',
    price: 199.9,
    description:
      'Camisa de botão com listras verticais azuis e brancas, elegante para o dia a dia.',
    sizes: SIZES_VESTUARIO,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80&auto=format',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80&auto=format'],
    purchaseUrl: 'https://example.com/produtos/camisa-listrada',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Vestido',
    color: 'Verde',
    price: 199.0,
    description: 'Vestido longo com manga e laço, ideal para ocasiões especiais.',
    sizes: SIZES_VESTUARIO,
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1339896/vestido_longo_nula_manga_laco_vivian_verde_bandeir_1_20251203155142_df97d2d56dd4.jpg',
    images: [
      'https://images.tcdn.com.br/img/img_prod/1339896/vestido_longo_nula_manga_laco_vivian_verde_bandeir_1_20251203155142_df97d2d56dd4.jpg',
    ],
    purchaseUrl: 'https://example.com/produtos/vestido-verde',
    store: LOJA_VERDE,
    storeName: LOJA_VERDE.name,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Casaco Terracota',
    color: 'Terracota',
    price: 289.0,
    description:
      'Casaco de tecido acetinado na cor terracota, leve e elegante para a meia estação.',
    sizes: SIZES_VESTUARIO,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80&auto=format',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80&auto=format'],
    purchaseUrl: 'https://example.com/produtos/casaco-terracota',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Calça Jeans',
    color: 'Jeans',
    price: 179.9,
    description: 'Calça jeans de cintura alta com corte reto, clássica e versátil.',
    sizes: SIZES_VESTUARIO,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80&auto=format',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80&auto=format'],
    purchaseUrl: 'https://example.com/produtos/calca-jeans',
    store: LOJA_VERDE,
    storeName: LOJA_VERDE.name,
    isAvailable: false,
  },
  {
    id: '5',
    name: 'Conjunto alfaiataria blazer e calça off-white para eventos',
    color: 'Off-white',
    price: 459.5,
    description: 'Conjunto social feminino de alfaiataria com calça flare, perfeito para eventos.',
    sizes: SIZES_VESTUARIO,
    imageUrl:
      'https://anellimn.com/cdn/shop/files/conjunto-social-feminino-alfaiataria-calca-flare-branco_4_7fd77dd7-f0f3-42a7-85c8-847f2f0e08be.webp?v=1782584244',
    images: [
      'https://anellimn.com/cdn/shop/files/conjunto-social-feminino-alfaiataria-calca-flare-branco_4_7fd77dd7-f0f3-42a7-85c8-847f2f0e08be.webp?v=1782584244',
    ],
    purchaseUrl: 'https://example.com/produtos/conjunto-alfaiataria',
    store: LOJA_VERDE,
    storeName: LOJA_VERDE.name,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Scarpin nude',
    color: 'Nude',
    price: 249.0,
    description: 'Scarpin de salto médio na cor nude, clássico e versátil para diversas ocasiões.',
    sizes: [
      { label: '35', available: true },
      { label: '36', available: true },
      { label: '37', available: true },
      { label: '38', available: false },
      { label: '39', available: true },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&auto=format',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&auto=format'],
    purchaseUrl: 'https://example.com/produtos/scarpin-nude',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
];

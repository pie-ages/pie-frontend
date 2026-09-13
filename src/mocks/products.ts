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
    name: 'Camiseta azul',
    color: 'Azul',
    price: 199.9,
    description: 'Camiseta casual de algodão na cor azul, perfeita para o dia a dia.',
    sizes: SIZES_VESTUARIO,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    ],
    purchaseUrl: 'https://example.com/produtos/camiseta-azul',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Vestido Verde',
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
    name: 'Camiseta azul',
    color: 'Azul',
    price: 199.9,
    description: 'Camiseta casual de algodão na cor azul, perfeita para o dia a dia.',
    sizes: SIZES_VESTUARIO,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    ],
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-2',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Camiseta azul',
    color: 'Azul',
    price: 199.9,
    description: 'Camiseta casual de algodão na cor azul, perfeita para o dia a dia.',
    sizes: SIZES_VESTUARIO,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaJVW2PbrLE6ScmQiPqNUESa2DJM1JiSHqMGzNj7-TA&s=10',
    ],
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-3',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
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
    name: 'Bolsa de couro',
    color: 'Marrom',
    price: 349.0,
    description: 'Bolsa tote de couro lezard na cor marrom com bolso lateral.',
    sizes: SIZES_UNICO,
    imageUrl:
      'https://corello.fbitsstatic.net/img/p/bolsa-tote-couro-lezard-marrom-couro-marrom-bolso-lateral-158546/351572-9.jpg?w=1600&v=202608251512',
    images: [
      'https://corello.fbitsstatic.net/img/p/bolsa-tote-couro-lezard-marrom-couro-marrom-bolso-lateral-158546/351572-9.jpg?w=1600&v=202608251512',
    ],
    purchaseUrl: 'https://example.com/produtos/bolsa-couro',
    store: LOJA_PIE,
    storeName: LOJA_PIE.name,
    isAvailable: true,
  },
];

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import WishlistScreen from '@/app/(screens)/Wishlist/index';
import { useWishlist } from '@/contexts/WishlistContext';
import { useWardrobeProductIds } from '@/hooks/UseWardrobeProductIds';
import type { CatalogItem } from '@/schemas/productSchema';

jest.mock('@/global.css', () => ({}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), canGoBack: () => true }),
}));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const anim: unknown = new Proxy({}, { get: () => () => anim });
  return {
    __esModule: true,
    default: { View },
    FadeIn: anim,
    FadeOut: anim,
    LinearTransition: anim,
    ReduceMotion: { System: 'system' },
  };
});
jest.mock('@/contexts/WishlistContext');
jest.mock('@/hooks/UseWardrobeProductIds');

const mockUseWishlist = jest.mocked(useWishlist);
const mockUseWardrobeProductIds = jest.mocked(useWardrobeProductIds);

const makeProduct = (id: string, name: string): CatalogItem =>
  ({
    id,
    name,
    category: 'Blusas',
    color: null,
    price: 50,
    imageUrl: null,
    purchaseUrl: null,
    companyName: 'Loja',
    status: 'PUBLISHED',
    styles: [],
    sizes: [],
    materials: [],
  }) as CatalogItem;

const owned = makeProduct('prod-1', 'Blusa Floral');
const notOwned = makeProduct('prod-2', 'Calça Jeans');

beforeEach(() => {
  jest.clearAllMocks();
  mockUseWishlist.mockReturnValue({
    items: [owned, notOwned],
    remove: jest.fn(),
  } as unknown as ReturnType<typeof useWishlist>);
});

describe('Wishlist — closet indicator', () => {
  it('marks only the wishlist products that are in the closet', async () => {
    mockUseWardrobeProductIds.mockReturnValue(new Set(['prod-1']));

    await render(<WishlistScreen />);

    expect(screen.getAllByLabelText('Esta peça já está no seu closet')).toHaveLength(1);
    expect(screen.getByText('Blusa Floral')).toBeTruthy();
    expect(screen.getByText('Calça Jeans')).toBeTruthy();
  });

  it('shows no indicator when none of the products is in the closet', async () => {
    mockUseWardrobeProductIds.mockReturnValue(new Set());

    await render(<WishlistScreen />);

    expect(screen.queryByLabelText('Esta peça já está no seu closet')).toBeNull();
  });

  it('removes the indicator once the piece leaves the closet', async () => {
    mockUseWardrobeProductIds.mockReturnValue(new Set(['prod-1']));
    const { rerender } = await render(<WishlistScreen />);
    expect(screen.getAllByLabelText('Esta peça já está no seu closet')).toHaveLength(1);

    mockUseWardrobeProductIds.mockReturnValue(new Set());
    await rerender(<WishlistScreen />);

    expect(screen.queryByLabelText('Esta peça já está no seu closet')).toBeNull();
  });
});

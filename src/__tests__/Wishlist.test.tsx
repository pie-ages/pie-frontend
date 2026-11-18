import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import WishlistScreen from '@/app/(screens)/Wishlist/index';
import { useWishlist } from '@/contexts/WishlistContext';
import { useWardrobeProductIds } from '@/hooks/UseWardrobeProductIds';
import type { CatalogItem } from '@/schemas/productSchema';

jest.mock('@/global.css', () => ({}));
const mockRouter = {
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  replace: jest.fn(),
  dismissTo: jest.fn(),
};
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
jest.mock('react-native-reanimated', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
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
    available: true,
    styles: [],
    sizes: [],
    materials: [],
  }) as CatalogItem;

const owned = makeProduct('prod-1', 'Blusa Floral');
const notOwned = makeProduct('prod-2', 'Calça Jeans');

beforeEach(() => {
  jest.clearAllMocks();
  mockRouter.canGoBack.mockReturnValue(true);
  mockUseWishlist.mockReturnValue({
    items: [owned, notOwned],
    remove: jest.fn(),
    isPending: () => false,
    isLoading: false,
    error: null,
    retry: jest.fn(),
  } as unknown as ReturnType<typeof useWishlist>);
});

describe('Wishlist navigation and loading', () => {
  beforeEach(() => {
    mockUseWardrobeProductIds.mockReturnValue(new Set());
  });

  it('opens the storefront from the empty state even without navigation history', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    mockUseWishlist.mockReturnValue({ ...mockUseWishlist(), items: [] });
    await render(<WishlistScreen />);
    await fireEvent.press(screen.getByRole('button', { name: 'Explorar Vitrine' }));
    expect(mockRouter.dismissTo).toHaveBeenCalledWith('/Storefront');
  });

  it('has a storefront fallback when closing a directly opened wishlist', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await render(<WishlistScreen />);
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar Wishlist' }));
    expect(mockRouter.replace).toHaveBeenCalledWith('/Storefront');
  });

  it('shows loading instead of an incorrect empty list', async () => {
    mockUseWishlist.mockReturnValue({ ...mockUseWishlist(), items: [], isLoading: true });
    await render(<WishlistScreen />);
    expect(screen.getByText('Carregando Wishlist...')).toBeTruthy();
    expect(screen.queryByText('Sua lista de desejos está vazia')).toBeNull();
  });

  it('allows retrying an initial API failure', async () => {
    const retry = jest.fn();
    mockUseWishlist.mockReturnValue({
      ...mockUseWishlist(),
      items: [],
      error: 'Sem conexão.',
      retry,
    });
    await render(<WishlistScreen />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Sua lista de desejos está vazia')).toBeNull();
  });
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

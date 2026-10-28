import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as WebBrowser from 'expo-web-browser';

import ProductDetailsScreen from '@/app/(screens)/ProductDetails/index';
import { WishlistProvider } from '@/contexts/WishlistContext';
import type { ProductPublicDetail } from '@/schemas/productSchema';
import { ApiError } from '@/services/client';
import * as products from '@/services/products';
import * as wardrobe from '@/services/wardrobe';

jest.mock('@/global.css', () => ({}));
const mockDismissTo = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ productId: 'prod-1' }),
  useRouter: () => ({ back: jest.fn(), canGoBack: () => true, dismissTo: mockDismissTo }),
}));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));
jest.mock('@/services/products');
jest.mock('@/services/wardrobe');

const mockFetchDetail = jest.mocked(products.fetchProductDetail);
const mockFetchIds = jest.mocked(wardrobe.fetchWardrobeProductIds);
const mockAdd = jest.mocked(wardrobe.addProductToWardrobe);
const mockOpenBrowser = jest.mocked(WebBrowser.openBrowserAsync);

const product: ProductPublicDetail = {
  id: 'prod-1',
  name: 'Blusa Floral',
  description: 'Blusa leve de verão.',
  category: 'Blusas',
  color: 'Azul',
  price: 99.9,
  imageUrl: 'https://cdn.pie.com.br/blusa.png',
  purchaseUrl: 'https://loja.com.br/blusa',
  companyName: 'Loja Aurora',
  styles: ['romantico'],
  sizes: [],
  materials: [],
  available: true,
  images: [],
  inWishlist: false,
};

const ADD_LABEL = 'Já tenho! Adicionar ao closet';
const IN_WARDROBE_LABEL = 'Esta peça já está no seu closet';
const STORE_LABEL = 'Comprar na loja Loja Aurora';

async function renderScreen() {
  await render(
    <WishlistProvider>
      <ProductDetailsScreen />
    </WishlistProvider>,
  );
  await screen.findByText('Descrição');
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchDetail.mockResolvedValue(product);
  mockFetchIds.mockResolvedValue(new Set());
  mockAdd.mockResolvedValue({} as Awaited<ReturnType<typeof wardrobe.addProductToWardrobe>>);
  mockOpenBrowser.mockResolvedValue({ type: 'opened' } as Awaited<
    ReturnType<typeof WebBrowser.openBrowserAsync>
  >);
});

describe('ProductDetails — wardrobe action', () => {
  it('adds the product, closes the modal and goes back to the storefront', async () => {
    await renderScreen();

    await fireEvent.press(await screen.findByRole('button', { name: ADD_LABEL }));

    await waitFor(() =>
      expect(mockDismissTo).toHaveBeenCalledWith({
        pathname: '/Storefront',
        params: { notice: '"Blusa Floral" foi adicionada ao seu closet!' },
      }),
    );
    expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
  });

  it('does not allow adding a product that is already in the wardrobe', async () => {
    mockFetchIds.mockResolvedValue(new Set(['prod-1']));
    await renderScreen();

    const button = await screen.findByRole('button', { name: IN_WARDROBE_LABEL });
    await fireEvent.press(button);

    expect(screen.getByRole('button', { name: IN_WARDROBE_LABEL, disabled: true })).toBeTruthy();
    expect(mockAdd).not.toHaveBeenCalled();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('stays on the modal, shows the error and keeps the button available to try again', async () => {
    mockAdd.mockRejectedValueOnce(new ApiError('Produto não encontrado.', 404));
    await renderScreen();

    await fireEvent.press(await screen.findByRole('button', { name: ADD_LABEL }));

    expect(await screen.findByText('Produto não encontrado.')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: ADD_LABEL, disabled: false })).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: ADD_LABEL }));

    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
  });
});

describe('ProductDetails — partner store action', () => {
  it('opens the product link of the partner store', async () => {
    await renderScreen();

    await fireEvent.press(await screen.findByRole('button', { name: STORE_LABEL }));

    await waitFor(() => expect(mockOpenBrowser).toHaveBeenCalledWith('https://loja.com.br/blusa'));
  });

  it('tells the user they are being sent to the partner store', async () => {
    await renderScreen();

    expect(
      await screen.findByText('Você será direcionado para o site da loja parceira.'),
    ).toBeTruthy();
  });

  it('shows an error when the store cannot be opened', async () => {
    mockOpenBrowser.mockRejectedValue(new Error('no browser'));
    await renderScreen();

    await fireEvent.press(await screen.findByRole('button', { name: STORE_LABEL }));

    expect(
      await screen.findByText('Não foi possível abrir a loja parceira. Tente novamente.'),
    ).toBeTruthy();
  });

  it.each([
    ['without a link', { purchaseUrl: null }],
    ['with an invalid link', { purchaseUrl: 'javascript:alert(1)' }],
    ['unavailable', { available: false }],
  ])('hides the store button for a product %s', async (_label, override) => {
    mockFetchDetail.mockResolvedValue({ ...product, ...override });
    await renderScreen();

    await screen.findByRole('button', { name: ADD_LABEL });

    expect(screen.queryByRole('button', { name: STORE_LABEL })).toBeNull();
  });

  it('keeps the wardrobe action available for products without a partner link', async () => {
    mockFetchDetail.mockResolvedValue({ ...product, purchaseUrl: null });
    await renderScreen();

    expect(await screen.findByRole('button', { name: ADD_LABEL, disabled: false })).toBeTruthy();
  });
});

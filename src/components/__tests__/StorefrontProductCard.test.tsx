import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import { WishlistProvider } from '@/contexts/WishlistContext';
import type { CatalogItem } from '@/schemas/productSchema';

jest.mock('@/global.css', () => ({}));
jest.mock('expo-image', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { Image: (props: object) => createElement(View, props) };
});

const product: CatalogItem = {
  id: 'prod-1',
  name: 'Blusa Floral',
  category: 'Blusas',
  color: 'Azul',
  price: 99.9,
  imageUrl: 'https://cdn/blusa.png',
  purchaseUrl: null,
  companyName: 'Loja Aurora',
  companyPhotoUrl: 'https://cdn/logo.png',
  status: 'PUBLISHED',
  styles: [],
  sizes: [],
  materials: [],
};

async function renderCard(item: CatalogItem = product, isInCloset?: boolean) {
  await render(
    <WishlistProvider>
      <StorefrontProductCard product={item} onPress={jest.fn()} isInCloset={isInCloset} />
    </WishlistProvider>,
  );
}

describe('StorefrontProductCard', () => {
  it('shows the logo of the store that owns the product', async () => {
    await renderCard(product);

    expect(screen.getByLabelText('Logo da loja Loja Aurora')).toBeTruthy();
    expect(screen.getByTestId('store-logo-image').props.source).toEqual({
      uri: 'https://cdn/logo.png',
    });
    expect(screen.getByText('Blusa Floral')).toBeTruthy();
  });

  it('shows the store initials when the store has no logo', async () => {
    await renderCard({ ...product, companyPhotoUrl: undefined });

    expect(screen.getByLabelText('Logo da loja Loja Aurora')).toBeTruthy();
    expect(screen.getByText('LA')).toBeTruthy();
  });

  it('shows the store badge also when the product has no photo', async () => {
    await renderCard({ ...product, imageUrl: null });

    expect(screen.getByTestId('store-logo-image')).toBeTruthy();
  });

  it('keeps product information and the closet indicator when the logo fails to load', async () => {
    await renderCard(product, true);

    await fireEvent(screen.getByTestId('store-logo-image'), 'error', { error: 'failed' });

    expect(screen.getByText('LA')).toBeTruthy();
    expect(screen.queryByTestId('store-logo-image')).toBeNull();
    expect(screen.getByText('Blusa Floral')).toBeTruthy();
    expect(screen.getByLabelText('Esta peça já está no seu closet')).toBeTruthy();
  });

  it('hides the store badge when the product has no store', async () => {
    await renderCard({ ...product, companyName: null, companyPhotoUrl: null });

    expect(screen.queryByLabelText(/Logo da loja/)).toBeNull();
  });
});

describe('StorefrontProductCard — closet indicator', () => {
  it('shows the indicator for a product that is in the closet', async () => {
    await renderCard(product, true);

    expect(screen.getByLabelText('Esta peça já está no seu closet')).toBeTruthy();
  });

  it('does not show the indicator for a product that is not in the closet', async () => {
    await renderCard(product, false);

    expect(screen.queryByLabelText('Esta peça já está no seu closet')).toBeNull();
  });

  it('does not show the indicator by default', async () => {
    await renderCard();

    expect(screen.queryByLabelText('Esta peça já está no seu closet')).toBeNull();
  });

  it('keeps showing the product data when it is in the closet', async () => {
    await renderCard(product, true);

    expect(screen.getByText('Blusa Floral')).toBeTruthy();
  });
});

import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

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

function renderCard(item: CatalogItem) {
  return render(
    <WishlistProvider>
      <StorefrontProductCard product={item} onPress={jest.fn()} />
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

  it('hides the store badge when the product has no store', async () => {
    await renderCard({ ...product, companyName: null, companyPhotoUrl: null });

    expect(screen.queryByLabelText(/Logo da loja/)).toBeNull();
  });
});

import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import { WishlistProvider } from '@/contexts/WishlistContext';
import type { CatalogItem } from '@/schemas/productSchema';

jest.mock('@/global.css', () => ({}));

const product: CatalogItem = {
  id: 'prod-1',
  name: 'Blusa Floral',
  category: 'Blusas',
  color: 'Azul',
  price: 99.9,
  imageUrl: null,
  purchaseUrl: 'https://loja.com.br/blusa',
  companyName: 'Loja',
  status: 'PUBLISHED',
  styles: [],
  sizes: [],
  materials: [],
} as CatalogItem;

async function renderCard(isInCloset?: boolean) {
  await render(
    <WishlistProvider>
      <StorefrontProductCard product={product} onPress={() => {}} isInCloset={isInCloset} />
    </WishlistProvider>,
  );
}

describe('StorefrontProductCard — closet indicator', () => {
  it('shows the indicator for a product that is in the closet', async () => {
    await renderCard(true);

    expect(screen.getByText('No closet')).toBeTruthy();
  });

  it('does not show the indicator for a product that is not in the closet', async () => {
    await renderCard(false);

    expect(screen.queryByText('No closet')).toBeNull();
  });

  it('does not show the indicator by default', async () => {
    await renderCard();

    expect(screen.queryByText('No closet')).toBeNull();
  });

  it('keeps showing the product data when it is in the closet', async () => {
    await renderCard(true);

    expect(screen.getByText('Blusa Floral')).toBeTruthy();
  });
});

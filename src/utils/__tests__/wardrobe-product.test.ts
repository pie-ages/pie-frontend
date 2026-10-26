import { describe, expect, it } from '@jest/globals';

import { buildWardrobeItemFromProduct, MissingProductImageError } from '@/utils/wardrobe-product';

const product = {
  id: 'prod-1',
  name: 'Blusa Floral',
  category: 'Blusas',
  color: 'Azul',
  styles: ['romantico'],
  imageUrl: 'https://cdn.pie.com.br/blusa.png',
};

describe('buildWardrobeItemFromProduct', () => {
  it('links the wardrobe item to the product and keeps its data', () => {
    const { payload } = buildWardrobeItemFromProduct(product);

    expect(payload).toEqual({
      productId: 'prod-1',
      name: 'Blusa Floral',
      category: 'Blusas',
      style: 'romantico',
      color: 'Azul',
    });
  });

  it('uses the product image as the wardrobe photo', () => {
    const { image } = buildWardrobeItemFromProduct(product);

    expect(image).toEqual({
      uri: 'https://cdn.pie.com.br/blusa.png',
      fileName: 'product-prod-1.png',
      mimeType: 'image/png',
    });
  });

  it('detects the image type ignoring the query string and defaults to jpeg', () => {
    expect(
      buildWardrobeItemFromProduct({ ...product, imageUrl: 'https://cdn.pie.com.br/a.webp?v=2' })
        .image.mimeType,
    ).toBe('image/webp');
    expect(
      buildWardrobeItemFromProduct({ ...product, imageUrl: 'https://cdn.pie.com.br/image' }).image,
    ).toMatchObject({ mimeType: 'image/jpeg', fileName: 'product-prod-1.jpg' });
  });

  it('falls back to the "Outros" category when the product has none', () => {
    expect(buildWardrobeItemFromProduct({ ...product, category: null }).payload.category).toBe(
      'Outros',
    );
    expect(buildWardrobeItemFromProduct({ ...product, category: '  ' }).payload.category).toBe(
      'Outros',
    );
  });

  it('normalizes the style and ignores styles the wardrobe does not accept', () => {
    expect(buildWardrobeItemFromProduct({ ...product, styles: ['Clássico'] }).payload.style).toBe(
      'classico',
    );
    expect(
      buildWardrobeItemFromProduct({ ...product, styles: ['sensual', 'Casual'] }).payload.style,
    ).toBe('casual');
    expect(
      buildWardrobeItemFromProduct({ ...product, styles: ['sensual'] }).payload.style,
    ).toBeNull();
    expect(buildWardrobeItemFromProduct({ ...product, styles: [] }).payload.style).toBeNull();
  });

  it('sends a null color when the product has none', () => {
    expect(buildWardrobeItemFromProduct({ ...product, color: null }).payload.color).toBeNull();
  });

  it('throws when the product has no image', () => {
    expect(() => buildWardrobeItemFromProduct({ ...product, imageUrl: null })).toThrow(
      MissingProductImageError,
    );
  });
});

import { describe, expect, it } from '@jest/globals';

import { buildLookItemRefs, mapLook, type WardrobePiece } from '@/types/Look';

const piece = (id: string, kind: 'wardrobe' | 'product'): WardrobePiece => ({
  id,
  category: 'x',
  imageUrl: null,
  wardrobeItemId: kind === 'wardrobe' ? id : null,
  productId: kind === 'product' ? id : null,
});

describe('buildLookItemRefs', () => {
  it('keeps the order in which pieces were added, interleaving wardrobe items and products', () => {
    const pieces = [
      piece('casaco', 'product'),
      piece('camisa', 'wardrobe'),
      piece('calca', 'product'),
    ];

    expect(buildLookItemRefs(pieces)).toEqual([
      { productId: 'casaco' },
      { wardrobeItemId: 'camisa' },
      { productId: 'calca' },
    ]);
  });

  it('returns an empty list for no pieces and skips pieces without a reference', () => {
    expect(buildLookItemRefs([])).toEqual([]);
    expect(buildLookItemRefs([{ id: 'x', category: 'x', imageUrl: null }])).toEqual([]);
  });

  it.each([1, 2, 3])('preserves a sequence of %i pieces', (count) => {
    const pieces = Array.from({ length: count }, (_, i) =>
      piece(`p${i}`, i % 2 === 0 ? 'wardrobe' : 'product'),
    );

    expect(buildLookItemRefs(pieces).map((r) => r.wardrobeItemId ?? r.productId)).toEqual(
      pieces.map((p) => p.id),
    );
  });
});

describe('mapLook', () => {
  it('keeps the API order when rendering', () => {
    const look = mapLook({
      id: 'l1',
      title: 'Look',
      occasion: null,
      photoUrl: null,
      items: [
        {
          wardrobeItemId: null,
          productId: 'casaco',
          name: 'Casaco',
          category: null,
          imageUrl: null,
        },
        {
          wardrobeItemId: 'camisa',
          productId: null,
          name: 'Camisa',
          category: null,
          imageUrl: null,
        },
        { wardrobeItemId: null, productId: 'tenis', name: 'Tênis', category: null, imageUrl: null },
      ],
    });

    expect(look.items.map((i) => i.id)).toEqual(['casaco', 'camisa', 'tenis']);
  });
});

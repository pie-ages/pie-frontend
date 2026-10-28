import { describe, expect, it } from '@jest/globals';

import { lookPieceRank, sortLookPieces } from '@/utils/look-order';

const piece = (category: string | null, name = category ?? 'sem categoria') => ({
  name,
  category,
});

const permutations = <T>(items: T[]): T[][] =>
  items.length <= 1
    ? [items]
    : items.flatMap((item, index) =>
        permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [
          item,
          ...rest,
        ]),
      );

const names = (pieces: { name: string }[]) => pieces.map((p) => p.name);

describe('lookPieceRank', () => {
  it.each([
    [0, ['Casaco', 'Casacos', 'jaqueta', 'blazer', 'Moletom']],
    [1, ['Camisa', 'Camisas', 'Camisetas', 'camiseta', 'blusa', 'regata']],
    [2, ['Vestido', 'Vestidos', 'Macacão']],
    [3, ['Calça', 'Calças', 'calca', 'Saias', 'short', 'bermuda']],
    [4, ['Tênis', 'tenis', 'Calçado', 'sapato', 'Sandália', 'bota']],
    [5, ['Bolsa', 'Cinto', '', null, undefined]],
  ])('ranks as %i: %j', (rank, categories) => {
    for (const category of categories) expect(lookPieceRank(category)).toBe(rank);
  });

  it('does not mistake calçado for calça', () => {
    expect(lookPieceRank('Calçado')).toBeGreaterThan(lookPieceRank('Calça'));
  });
});

describe('sortLookPieces', () => {
  const casaco = piece('Casaco');
  const camisa = piece('Camisa');
  const calca = piece('Calça');
  const tenis = piece('Tênis');

  const picks = (pieces: ReturnType<typeof piece>[]) =>
    permutations(pieces).map((order) => ({ picked: names(order).join(' → '), order }));

  it.each(picks([casaco, camisa, calca, tenis]))(
    'orders a 4-piece look as casaco → camisa → calça → tênis (picked $picked)',
    ({ order }) => {
      expect(names(sortLookPieces(order))).toEqual(['Casaco', 'Camisa', 'Calça', 'Tênis']);
    },
  );

  it.each(picks([casaco, camisa, calca]))(
    'orders a 3-piece look as casaco → camisa → calça (picked $picked)',
    ({ order }) => {
      expect(names(sortLookPieces(order))).toEqual(['Casaco', 'Camisa', 'Calça']);
    },
  );

  it('keeps the picked order inside the same layer', () => {
    const first = piece('Camisa', 'camisa branca');
    const second = piece('Camisetas', 'camiseta preta');

    expect(names(sortLookPieces([second, first]))).toEqual(['camiseta preta', 'camisa branca']);
  });

  it('puts unknown categories last, in the order they came', () => {
    const bolsa = piece('Bolsa');
    const cinto = piece('Cinto');

    expect(names(sortLookPieces([bolsa, tenis, cinto, casaco]))).toEqual([
      'Casaco',
      'Tênis',
      'Bolsa',
      'Cinto',
    ]);
  });

  it('does not mutate the input', () => {
    const input = [tenis, casaco];

    sortLookPieces(input);

    expect(names(input)).toEqual(['Tênis', 'Casaco']);
  });
});

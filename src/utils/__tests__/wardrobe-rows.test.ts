import { describe, expect, it } from '@jest/globals';

import type { WardrobePiece } from '@/types/Look';
import {
  createWardrobeStore,
  wardrobeReducer,
  type WardrobeRowPage,
  type WardrobeState,
} from '@/utils/wardrobe-rows';

const piece = (id: string, category: string): WardrobePiece => ({
  id,
  name: `Peça ${id}`,
  imageUrl: null,
  category,
});

const row = (category: string, ids: string[]): WardrobeRowPage => ({
  id: category,
  title: category,
  items: ids.map((id) => piece(id, category)),
  hasNext: false,
});

function loadedState(rows: WardrobeRowPage[]): WardrobeState {
  return wardrobeReducer(
    wardrobeReducer({ status: 'loading', rowIds: [], rows: {} }, { type: 'load' }),
    {
      type: 'loaded',
      rows,
    },
  );
}

describe('wardrobeReducer — itemRemoved', () => {
  it('removes only the chosen piece and keeps the rest of the row', () => {
    const state = loadedState([row('Calça', ['a', 'b']), row('Blusa', ['c'])]);

    const next = wardrobeReducer(state, { type: 'itemRemoved', itemId: 'a' });

    expect(next.rows['Calça'].items.map((item) => item.id)).toEqual(['b']);
    expect(next.rowIds).toEqual(['Calça', 'Blusa']);
    expect(next.status).toBe('success');
  });

  it('drops the category when its last piece is removed', () => {
    const state = loadedState([row('Calça', ['a']), row('Blusa', ['c'])]);

    const next = wardrobeReducer(state, { type: 'itemRemoved', itemId: 'a' });

    expect(next.rowIds).toEqual(['Blusa']);
    expect(next.rows['Calça']).toBeUndefined();
    expect(next.status).toBe('success');
  });

  it('becomes empty when the last piece of the closet is removed', () => {
    const state = loadedState([row('Calça', ['a'])]);

    const next = wardrobeReducer(state, { type: 'itemRemoved', itemId: 'a' });

    expect(next.status).toBe('empty');
    expect(next.rowIds).toEqual([]);
  });

  it('ignores a piece that is not in the closet', () => {
    const state = loadedState([row('Calça', ['a'])]);

    expect(wardrobeReducer(state, { type: 'itemRemoved', itemId: 'zzz' })).toBe(state);
  });
});

describe('createWardrobeStore — removeItem', () => {
  it('removes the piece from the loaded state and notifies subscribers', async () => {
    const store = createWardrobeStore(async () => [row('Calça', ['a', 'b'])]);
    await store.loadInitial();
    let notifications = 0;
    store.subscribe(() => {
      notifications += 1;
    });

    store.removeItem('a');

    expect(store.getState().rows['Calça'].items.map((item) => item.id)).toEqual(['b']);
    expect(notifications).toBe(1);
  });
});

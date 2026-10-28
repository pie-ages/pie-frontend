import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useWardrobeRows } from '@/hooks/UseWardrobeRows';
import { ApiError } from '@/services/client';
import * as wardrobe from '@/services/wardrobe';
import type { WardrobeRowPage } from '@/utils/wardrobe-rows';

jest.mock('@/services/wardrobe');

const mockFetchWardrobe = jest.mocked(wardrobe.fetchWardrobe);
const mockDelete = jest.mocked(wardrobe.deleteWardrobeItem);

const rows: WardrobeRowPage[] = [
  {
    id: 'Calça',
    title: 'Calça',
    hasNext: false,
    items: [
      { id: 'a', name: 'Calça A', imageUrl: null, category: 'Calça' },
      { id: 'b', name: 'Calça B', imageUrl: null, category: 'Calça' },
    ],
  },
];

async function renderRows() {
  const hook = await renderHook(() => useWardrobeRows());
  await act(async () => {});
  return hook;
}

const itemIds = (result: Awaited<ReturnType<typeof renderRows>>['result']) =>
  result.current.rows.flatMap((row) => row.items.map((item) => item.id));

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchWardrobe.mockResolvedValue(rows);
  mockDelete.mockResolvedValue(undefined);
});

describe('useWardrobeRows — removeItem', () => {
  it('deletes the piece on the server and removes it from the closet', async () => {
    const { result } = await renderRows();

    await act(async () => result.current.removeItem('a'));

    expect(mockDelete).toHaveBeenCalledWith('a');
    expect(itemIds(result)).toEqual(['b']);
  });

  it('keeps the piece when the server fails and lets the caller handle the error', async () => {
    mockDelete.mockRejectedValue(new ApiError('Erro no servidor', 500));
    const { result } = await renderRows();

    await act(async () => {
      await expect(result.current.removeItem('a')).rejects.toThrow('Erro no servidor');
    });

    expect(itemIds(result)).toEqual(['a', 'b']);
  });

  it('removes the piece locally when the server says it no longer exists', async () => {
    mockDelete.mockRejectedValue(new ApiError('Peça não encontrada.', 404));
    const { result } = await renderRows();

    await act(async () => result.current.removeItem('a'));

    expect(itemIds(result)).toEqual(['b']);
  });

  it('ignores a second removal of the same piece while the first is running', async () => {
    let finish!: () => void;
    mockDelete.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { result } = await renderRows();

    await act(async () => {
      void result.current.removeItem('a');
      void result.current.removeItem('a');
    });
    await act(async () => finish());

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('shows the empty closet after removing the last piece', async () => {
    mockFetchWardrobe.mockResolvedValue([{ ...rows[0], items: [rows[0].items[0]] }]);
    const { result } = await renderRows();

    await act(async () => result.current.removeItem('a'));

    expect(result.current.status).toBe('empty');
  });
});

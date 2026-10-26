import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { fetchLookSuggestion } from '@/services/looks';
import type { WardrobePiece } from '@/types/Look';

import { useLookForm } from '../UseLookForm';

jest.mock('@/services/looks', () => ({
  createLook: jest.fn(),
  fetchLookSuggestion: jest.fn(),
  uploadLookImage: jest.fn(),
}));

const makePiece = (id: string): WardrobePiece => ({
  id,
  name: `Peça ${id}`,
  imageUrl: null,
  category: 'Outros',
  wardrobeItemId: id,
});

describe('useLookForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maintains fixed slots when removing a piece and changing quantity', async () => {
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(3));
    await act(async () => result.current.assignPiece(0, makePiece('one')));
    await act(async () => result.current.assignPiece(2, makePiece('three')));
    await act(async () => result.current.removePieceAt(0));

    expect(result.current.slots).toEqual([null, null, makePiece('three')]);
    expect(result.current.items).toEqual([makePiece('three')]);

    await act(async () => result.current.choosePieceCount(4));
    expect(result.current.slots).toHaveLength(4);
    expect(result.current.slots[2]).toEqual(makePiece('three'));

    await act(async () => result.current.choosePieceCount(1));
    expect(result.current.slots).toEqual([null]);
  });

  it('requests only empty slots and fills them without replacing selected pieces', async () => {
    jest
      .mocked(fetchLookSuggestion)
      .mockResolvedValue([makePiece('one'), makePiece('two'), makePiece('three')]);
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(4));
    await act(async () => result.current.assignPiece(0, makePiece('existing')));

    await act(async () => {
      await result.current.requestSuggestion();
    });

    expect(fetchLookSuggestion).toHaveBeenCalledWith();
    expect(result.current.suggestion).toHaveLength(3);

    await act(async () => result.current.acceptSuggestion());

    expect(result.current.slots).toEqual([
      makePiece('existing'),
      makePiece('one'),
      makePiece('two'),
      makePiece('three'),
    ]);
    expect(result.current.isComplete).toBe(true);
  });

  it('does not open an empty suggestion result', async () => {
    jest.mocked(fetchLookSuggestion).mockResolvedValue([]);
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(1));

    await act(async () => {
      await result.current.requestSuggestion();
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.error).toMatch(/Não há peças disponíveis/);
  });
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useController } from 'react-hook-form';

import { createLook, fetchLookSuggestion } from '@/services/looks';
import type { WardrobePiece } from '@/types/Look';

import { useLookForm } from '../UseLookForm';

jest.mock('@/services/looks', () => ({
  createLook: jest.fn(),
  fetchLookSuggestion: jest.fn(),
  uploadLookImage: jest.fn(),
}));

const makePiece = (id: string, category = 'Outros'): WardrobePiece => ({
  id,
  name: `Peça ${id}`,
  imageUrl: null,
  category,
  wardrobeItemId: id,
});

const casaco = makePiece('casaco', 'Casaco');
const camisa = makePiece('camisa', 'Camisa');
const calca = makePiece('calca', 'Calça');
const tenis = makePiece('tenis', 'Tênis');

describe('useLookForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps pieces in look order, packed at the start, when removing and changing quantity', async () => {
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(3));
    await act(async () => result.current.assignPiece(0, tenis));
    await act(async () => result.current.assignPiece(1, casaco));

    expect(result.current.slots).toEqual([casaco, tenis, null]);
    expect(result.current.items).toEqual([casaco, tenis]);

    await act(async () => result.current.removePieceAt(0));
    expect(result.current.slots).toEqual([tenis, null, null]);
    expect(result.current.items).toEqual([tenis]);

    await act(async () => result.current.choosePieceCount(4));
    expect(result.current.slots).toEqual([tenis, null, null, null]);

    await act(async () => result.current.choosePieceCount(1));
    expect(result.current.slots).toEqual([tenis]);
  });

  it('reorders the look as pieces are picked, whatever the slot that was tapped', async () => {
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(4));
    await act(async () => result.current.assignPiece(3, tenis));
    expect(result.current.slots).toEqual([tenis, null, null, null]);

    await act(async () => result.current.assignPiece(2, calca));
    expect(result.current.slots).toEqual([calca, tenis, null, null]);

    await act(async () => result.current.assignPiece(3, casaco));
    expect(result.current.slots).toEqual([casaco, calca, tenis, null]);

    await act(async () => result.current.assignPiece(3, camisa));
    expect(result.current.slots).toEqual([casaco, camisa, calca, tenis]);
    expect(result.current.items).toEqual([casaco, camisa, calca, tenis]);
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

  it('places accepted suggestions in look order around the pieces already chosen', async () => {
    jest.mocked(fetchLookSuggestion).mockResolvedValue([camisa, casaco]);
    const { result } = await renderHook(() => useLookForm());

    await act(async () => result.current.choosePieceCount(3));
    await act(async () => result.current.assignPiece(0, tenis));
    await act(async () => {
      await result.current.requestSuggestion();
    });
    await act(async () => result.current.acceptSuggestion());

    expect(result.current.slots).toEqual([casaco, camisa, tenis]);
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

  describe('saveLook', () => {
    const makeProduct = (id: string, category: string): WardrobePiece => ({
      id,
      name: `Produto ${id}`,
      imageUrl: null,
      category,
      wardrobeItemId: null,
      productId: id,
    });

    const renderForm = () =>
      renderHook(() => {
        const form = useLookForm();
        const title = useController({ control: form.control, name: 'title' });
        return { form, title };
      });

    async function save(
      result: Awaited<ReturnType<typeof renderForm>>['result'],
      pieces: WardrobePiece[],
    ) {
      jest.mocked(createLook).mockResolvedValue({ id: 'look-1' } as never);
      const onSuccess = jest.fn();

      await act(async () => result.current.form.choosePieceCount(pieces.length));
      for (const [index, piece] of pieces.entries()) {
        await act(async () => result.current.form.assignPiece(index, piece));
      }
      await act(async () => result.current.title.field.onChange('Look de teste'));
      await act(async () => {
        await result.current.form.saveLook(null, onSuccess);
      });
      return onSuccess;
    }

    const sentItems = () => jest.mocked(createLook).mock.calls[0][0].items;

    it.each([1, 2, 3, 4])(
      'sends %i pieces in look order even when they were picked in reverse',
      async (count) => {
        const { result } = await renderForm();
        const lookOrder = [casaco, camisa, calca, tenis].slice(0, count);

        const onSuccess = await save(result, [...lookOrder].reverse());

        expect(createLook).toHaveBeenCalledTimes(1);
        expect(createLook).toHaveBeenCalledWith({
          title: 'Look de teste',
          occasion: undefined,
          items: lookOrder.map((piece) => ({ wardrobeItemId: piece.id })),
        });
        expect(onSuccess).toHaveBeenCalledTimes(1);
      },
    );

    it('sends a 3-piece look as casaco → camisa → calça', async () => {
      const { result } = await renderForm();

      await save(result, [calca, casaco, camisa]);

      expect(sentItems()).toEqual([
        { wardrobeItemId: 'casaco' },
        { wardrobeItemId: 'camisa' },
        { wardrobeItemId: 'calca' },
      ]);
    });

    it('keeps wardrobe items and products interleaved in look order', async () => {
      const { result } = await renderForm();

      await save(result, [
        tenis,
        makeProduct('calca-loja', 'calca'),
        camisa,
        makeProduct('casaco-loja', 'casaco'),
      ]);

      expect(sentItems()).toEqual([
        { productId: 'casaco-loja' },
        { wardrobeItemId: 'camisa' },
        { productId: 'calca-loja' },
        { wardrobeItemId: 'tenis' },
      ]);
    });

    it('does not call the API while the look still has empty slots', async () => {
      const { result } = await renderForm();

      await act(async () => result.current.form.choosePieceCount(3));
      await act(async () => result.current.form.assignPiece(0, casaco));
      await act(async () => result.current.title.field.onChange('Look de teste'));
      await act(async () => {
        await result.current.form.saveLook(null, jest.fn());
      });

      expect(createLook).not.toHaveBeenCalled();
    });
  });
});

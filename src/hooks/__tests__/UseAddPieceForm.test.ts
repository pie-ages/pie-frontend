import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';

import { analyzeWardrobeImage, createWardrobeItem } from '@/api/wardrobe';
import { useAddPieceForm } from '@/hooks/UseAddPieceForm';

jest.mock('@/api/wardrobe', () => ({
  analyzeWardrobeImage: jest.fn(),
  createWardrobeItem: jest.fn(),
}));

const analyze = jest.mocked(analyzeWardrobeImage);
const create = jest.mocked(createWardrobeItem);
const image = { uri: 'file:///dress.jpg', mimeType: 'image/jpeg', fileSize: 1024 };
const result = { category: 'vestido', style: 'romantico', color: 'verde' };

describe('wardrobe photo analysis', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sends one selected photo and fills editable fields without saving', async () => {
    analyze.mockResolvedValueOnce(result);
    const { result: hook } = renderHook(() => useAddPieceForm());
    await act(async () => {
      await hook.current.selectImage(image);
    });
    expect(analyze).toHaveBeenCalledTimes(1);
    expect(analyze).toHaveBeenCalledWith(image, expect.any(AbortSignal));
    expect(hook.current.category).toBe('vestido');
    expect(hook.current.style).toBe('romantico');
    expect(hook.current.color).toBe('verde');
    expect(hook.current.isAnalyzed).toBe(true);
    expect(hook.current.operation).toBeNull();
    expect(create).not.toHaveBeenCalled();
    act(() => hook.current.setStyle('casual'));
    expect(hook.current.style).toBe('casual');
  });

  it('does not retry errors and keeps the image available for manual entry', async () => {
    analyze.mockRejectedValueOnce(new Error('Envie outra foto.'));
    create.mockResolvedValueOnce({
      id: 'id',
      name: 'Vestido',
      productId: null,
      photoUrl: null,
      ...result,
    });
    const { result: hook } = renderHook(() => useAddPieceForm());
    await act(async () => {
      await hook.current.selectImage(image);
    });
    expect(hook.current.analysisError).toBe('Envie outra foto.');
    expect(hook.current.image).toEqual(image);
    expect(hook.current.operation).toBeNull();
    expect(analyze).toHaveBeenCalledTimes(1);
    act(() => {
      hook.current.setName('Vestido');
      hook.current.setCategory('vestido');
      hook.current.setStyle('casual');
      hook.current.setColor('verde');
    });
    await act(async () => {
      expect(await hook.current.submit()).toBe(true);
    });
    expect(create).toHaveBeenCalledWith(
      { name: 'Vestido', category: 'vestido', style: 'casual', color: 'verde' },
      image,
    );
    expect(analyze).toHaveBeenCalledTimes(1);
  });

  it('starts a new analysis only when another photo is selected', async () => {
    analyze.mockRejectedValueOnce(new Error('Envie outra foto.')).mockResolvedValueOnce(result);
    const { result: hook } = renderHook(() => useAddPieceForm());
    await act(async () => {
      await hook.current.selectImage(image);
    });
    const nextImage = { ...image, uri: 'file:///next.jpg' };
    await act(async () => {
      await hook.current.selectImage(nextImage);
    });
    expect(analyze).toHaveBeenCalledTimes(2);
    expect(hook.current.analysisError).toBeNull();
    expect(hook.current.image).toEqual(nextImage);
    expect(hook.current.category).toBe('vestido');
  });

  it('blocks saving during analysis and ignores results from an older photo', async () => {
    let finishFirst!: (value: typeof result) => void;
    analyze.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    );
    analyze.mockResolvedValueOnce({ category: 'camisa', style: 'classico', color: 'branco' });
    const { result: hook } = renderHook(() => useAddPieceForm());
    act(() => {
      void hook.current.selectImage(image);
    });
    expect(hook.current.operation).toBe('analyze');
    await act(async () => {
      expect(await hook.current.submit()).toBe(false);
    });
    expect(create).not.toHaveBeenCalled();
    const oldSignal = analyze.mock.calls[0][1];
    await act(async () => {
      await hook.current.selectImage({ ...image, uri: 'file:///shirt.jpg' });
    });
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => finishFirst(result));
    expect(hook.current.category).toBe('camisa');
    expect(hook.current.style).toBe('classico');
  });

  it('rejects unsupported or oversized photos without a paid inference', async () => {
    const { result: hook } = renderHook(() => useAddPieceForm());
    await act(async () => {
      await hook.current.selectImage({ ...image, mimeType: 'image/heic' });
    });
    expect(hook.current.analysisError).toContain('Formato não suportado');
    await act(async () => {
      await hook.current.selectImage({ ...image, fileSize: 3_932_161 });
    });
    expect(hook.current.analysisError).toContain('3,75 MB');
    expect(analyze).not.toHaveBeenCalled();
  });

  it('aborts analysis on unmount', async () => {
    analyze.mockImplementationOnce(() => new Promise(() => {}));
    const { result: hook, unmount } = renderHook(() => useAddPieceForm());
    act(() => {
      void hook.current.selectImage(image);
    });
    const signal = analyze.mock.calls[0][1];
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});

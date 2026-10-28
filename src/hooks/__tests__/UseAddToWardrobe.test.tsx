import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useAddToWardrobe } from '@/hooks/UseAddToWardrobe';
import type { ProductPublicDetail } from '@/schemas/productSchema';
import { ApiError } from '@/services/client';
import * as wardrobe from '@/services/wardrobe';
import { MissingProductImageError } from '@/utils/wardrobe-product';

jest.mock('@/services/wardrobe');

const mockFetchIds = jest.mocked(wardrobe.fetchWardrobeProductIds);
const mockAdd = jest.mocked(wardrobe.addProductToWardrobe);

const product: ProductPublicDetail = {
  id: 'prod-1',
  name: 'Blusa Floral',
  description: null,
  category: 'Blusas',
  color: 'Azul',
  price: 99,
  imageUrl: 'https://cdn.pie.com.br/blusa.png',
  purchaseUrl: 'https://loja.com.br/blusa',
  companyName: 'Loja',
  styles: ['romantico'],
  sizes: [],
  materials: [],
  available: true,
  images: [],
  inWishlist: false,
};

async function renderAdd(item: ProductPublicDetail | null = product) {
  const hook = await renderHook(() => useAddToWardrobe(item));
  await act(async () => {});
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchIds.mockResolvedValue(new Set());
  mockAdd.mockResolvedValue({} as Awaited<ReturnType<typeof wardrobe.addProductToWardrobe>>);
});

describe('useAddToWardrobe — checking the wardrobe', () => {
  it('shows the checking state until the wardrobe answers', async () => {
    let answer!: (ids: Set<string>) => void;
    mockFetchIds.mockImplementation(
      () =>
        new Promise((resolve) => {
          answer = resolve;
        }),
    );
    const { result } = await renderHook(() => useAddToWardrobe(product));
    expect(result.current.isChecking).toBe(true);

    await act(async () => answer(new Set()));

    expect(result.current.isChecking).toBe(false);
    expect(result.current.isInWardrobe).toBe(false);
  });

  it('marks a product already in the wardrobe', async () => {
    mockFetchIds.mockResolvedValue(new Set(['prod-1']));

    const { result } = await renderAdd();

    expect(result.current.isInWardrobe).toBe(true);
  });

  it('still allows adding when the wardrobe check fails', async () => {
    mockFetchIds.mockRejectedValue(new Error('offline'));

    const { result } = await renderAdd();

    expect(result.current.isChecking).toBe(false);
    expect(result.current.isInWardrobe).toBe(false);
  });

  it('does not check the wardrobe without a product', async () => {
    await renderAdd(null);

    expect(mockFetchIds).not.toHaveBeenCalled();
  });
});

describe('useAddToWardrobe — adding', () => {
  it('adds the product, marks it as in the wardrobe and reports success', async () => {
    const { result } = await renderAdd();

    let added: boolean | undefined;
    await act(async () => {
      added = await result.current.add();
    });

    expect(added).toBe(true);

    expect(mockAdd).toHaveBeenCalledWith(product);
    expect(result.current.isInWardrobe).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('shows the loading state while adding', async () => {
    let finish!: () => void;
    mockAdd.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({} as Awaited<ReturnType<typeof wardrobe.addProductToWardrobe>>);
        }),
    );
    const { result } = await renderAdd();

    await act(async () => {
      void result.current.add();
    });
    expect(result.current.isAdding).toBe(true);

    await act(async () => finish());
    expect(result.current.isAdding).toBe(false);
  });

  it('ignores a second press while the first one is still running', async () => {
    let finish!: () => void;
    mockAdd.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({} as Awaited<ReturnType<typeof wardrobe.addProductToWardrobe>>);
        }),
    );
    const { result } = await renderAdd();

    await act(async () => {
      void result.current.add();
      void result.current.add();
    });
    await act(async () => finish());

    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('does not add a product that is already in the wardrobe', async () => {
    mockFetchIds.mockResolvedValue(new Set(['prod-1']));
    const { result } = await renderAdd();

    let added: boolean | undefined;
    await act(async () => {
      added = await result.current.add();
    });

    expect(added).toBe(false);
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('shows the server message on API errors and allows trying again', async () => {
    mockAdd.mockRejectedValueOnce(new ApiError('Produto não encontrado.', 404));
    const { result } = await renderAdd();

    let added: boolean | undefined;
    await act(async () => {
      added = await result.current.add();
    });

    expect(added).toBe(false);
    expect(result.current.error).toBe('Produto não encontrado.');
    expect(result.current.isInWardrobe).toBe(false);

    await act(async () => result.current.add());

    expect(result.current.error).toBeNull();
    expect(result.current.isInWardrobe).toBe(true);
  });

  it('shows the image message when the product has no photo', async () => {
    mockAdd.mockRejectedValue(new MissingProductImageError());
    const { result } = await renderAdd();

    await act(async () => result.current.add());

    expect(result.current.error).toBe('Este produto não tem imagem para ser adicionado ao closet.');
  });

  it('shows a generic message on unexpected errors', async () => {
    mockAdd.mockRejectedValue(new Error('Network request failed'));
    const { result } = await renderAdd();

    await act(async () => result.current.add());

    expect(result.current.error).toBe(
      'Não foi possível adicionar a peça ao closet. Tente novamente.',
    );
  });
});

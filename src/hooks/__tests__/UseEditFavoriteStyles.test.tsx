import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useEditFavoriteStyles } from '@/hooks/UseEditFavoriteStyles';
import { getFavoriteStyles, updateFavoriteStyles } from '@/services/style';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('@/services/style', () => ({
  StyleSessionError: class StyleSessionError extends Error {},
  getFavoriteStyles: jest.fn(),
  updateFavoriteStyles: jest.fn(),
}));

const mockGetFavoriteStyles = jest.mocked(getFavoriteStyles);
const mockUpdateFavoriteStyles = jest.mocked(updateFavoriteStyles);

async function renderLoadedHook() {
  const hook = await renderHook(() => useEditFavoriteStyles());
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  return hook;
}

describe('useEditFavoriteStyles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFavoriteStyles.mockResolvedValue(['ELEGANTE']);
    mockUpdateFavoriteStyles.mockResolvedValue(['ELEGANTE', 'CASUAL']);
  });

  it('carrega os estilos favoritos como selecionados', async () => {
    const { result } = await renderLoadedHook();

    expect([...result.current.selectedIds]).toEqual(['ELEGANTE']);
    expect(result.current.styleOptions).toHaveLength(6);
  });

  it('salva os estilos selecionados na ordem do catálogo e volta para o perfil', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.toggle('CASUAL'));
    await act(async () => result.current.save());

    expect(mockUpdateFavoriteStyles).toHaveBeenCalledWith(['CASUAL', 'ELEGANTE']);
    expect(router.back).toHaveBeenCalled();
  });

  it('não permite salvar sem nenhum estilo', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.toggle('ELEGANTE'));

    expect(result.current.canSave).toBe(false);
    await act(async () => result.current.save());
    expect(mockUpdateFavoriteStyles).not.toHaveBeenCalled();
  });

  it('mostra erro quando o salvamento falha', async () => {
    mockUpdateFavoriteStyles.mockRejectedValue(new Error('falhou'));
    const { result } = await renderLoadedHook();

    await act(async () => result.current.save());

    expect(result.current.error).toBe('Não foi possível salvar seus estilos. Tente novamente.');
    expect(router.back).not.toHaveBeenCalled();
  });
});

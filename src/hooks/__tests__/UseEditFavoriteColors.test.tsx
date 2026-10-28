import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useEditFavoriteColors } from '@/hooks/UseEditFavoriteColors';
import { fetchPreferences, updateFavoriteColors } from '@/services/preferences';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('@/services/preferences');

const mockFetchPreferences = jest.mocked(fetchPreferences);
const mockUpdateFavoriteColors = jest.mocked(updateFavoriteColors);

async function renderLoadedHook() {
  const hook = await renderHook(() => useEditFavoriteColors());
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  return hook;
}

describe('useEditFavoriteColors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchPreferences.mockResolvedValue({
      highlightColors: [],
      avoidColors: [],
      favoriteColors: ['#FF0000', '#00FF00'],
    });
    mockUpdateFavoriteColors.mockResolvedValue(undefined);
  });

  it('carrega as cores favoritas em quatro posições', async () => {
    const { result } = await renderLoadedHook();

    expect(result.current.slots).toEqual(['#FF0000', '#00FF00', null, null]);
  });

  it('salva as cores trocadas e adicionadas e volta para o perfil', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.selectColor(1, '#0000ff'));
    await act(async () => result.current.selectColor(2, '#ffff00'));
    await act(async () => result.current.removeColor(0));
    await act(async () => result.current.save());

    expect(mockUpdateFavoriteColors).toHaveBeenCalledWith(['#0000FF', '#FFFF00']);
    expect(router.back).toHaveBeenCalled();
  });

  it('rejeita cor repetida', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.selectColor(2, '#ff0000'));

    expect(result.current.error).toBe('Essa cor já está nas suas favoritas.');
    expect(result.current.slots[2]).toBeNull();
  });

  it('mostra erro quando o salvamento falha', async () => {
    mockUpdateFavoriteColors.mockRejectedValue(new Error('falhou'));
    const { result } = await renderLoadedHook();

    await act(async () => result.current.save());

    expect(result.current.error).toBe(
      'Não foi possível salvar suas cores favoritas. Tente novamente.',
    );
    expect(router.back).not.toHaveBeenCalled();
  });
});

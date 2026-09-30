/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';

import * as preferencesApi from '@/api/preferences';
import { useColorimetryPreferences } from '@/hooks/UseColorimetryPreferences';

jest.mock('@/api/preferences', () => ({
  fetchPreferences: jest.fn(),
  updateFavoriteColors: jest.fn(),
}));

const mockFetchPreferences = preferencesApi.fetchPreferences as jest.MockedFunction<
  typeof preferencesApi.fetchPreferences
>;
const mockUpdateFavoriteColors = preferencesApi.updateFavoriteColors as jest.MockedFunction<
  typeof preferencesApi.updateFavoriteColors
>;

const MOCK_PREFERENCES = {
  highlightColors: ['#B18462', '#7A1111', '#D0AB95', '#684A36'],
  avoidColors: ['#FF3152', '#C22DD7', '#5D4FEA', '#0DB8C8'],
  favoriteColors: ['#8A6F5A', '#D9B44A', '#4A6FA5', '#FFFFFF'],
};

describe('useColorimetryPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carrega preferências com resposta válida', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);

    const { result } = renderHook(() => useColorimetryPreferences());

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.preferences).toEqual(MOCK_PREFERENCES);
  });

  it('preserves empty favorite colors from the backend', async () => {
    mockFetchPreferences.mockResolvedValueOnce({
      ...MOCK_PREFERENCES,
      favoriteColors: [],
    });

    const { result } = renderHook(() => useColorimetryPreferences());

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.preferences!.favoriteColors).toEqual([]);
  });

  it('expõe exatamente highlightColors e avoidColors retornados pelo backend', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);

    const { result } = renderHook(() => useColorimetryPreferences());

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.preferences!.highlightColors).toEqual(MOCK_PREFERENCES.highlightColors);
    expect(result.current.preferences!.avoidColors).toEqual(MOCK_PREFERENCES.avoidColors);
  });

  it('highlightColors e avoidColors não possuem função de edição no hook', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);

    const { result } = renderHook(() => useColorimetryPreferences());

    await waitFor(() => expect(result.current.status).toBe('success'));

    const keys = Object.keys(result.current);
    expect(keys).not.toContain('setHighlightColors');
    expect(keys).not.toContain('setAvoidColors');
    expect(result.current.saveFavoriteColors).toBeDefined();
  });

  it('salva somente favoriteColors no PUT', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    mockUpdateFavoriteColors.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useColorimetryPreferences());
    await waitFor(() => expect(result.current.status).toBe('success'));

    const newFavorites = ['#111111', '#222222', '#333333', '#444444'];

    await act(async () => {
      await result.current.saveFavoriteColors(newFavorites);
    });

    expect(mockUpdateFavoriteColors).toHaveBeenCalledTimes(1);
    expect(mockUpdateFavoriteColors).toHaveBeenCalledWith(newFavorites);
  });

  it('retorna status error quando o GET falha', async () => {
    mockFetchPreferences.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useColorimetryPreferences());

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.preferences).toBeNull();
  });

  it('define saveError quando o PUT falha', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    mockUpdateFavoriteColors.mockRejectedValueOnce(new Error('Save error'));

    const { result } = renderHook(() => useColorimetryPreferences());
    await waitFor(() => expect(result.current.status).toBe('success'));

    await act(async () => {
      await result.current.saveFavoriteColors(['#111111', '#222222', '#333333', '#444444']);
    });

    expect(result.current.saveError).toBe('Não foi possível salvar. Tente novamente.');
    expect(result.current.isSaving).toBe(false);
  });

  it('bloqueia múltiplos envios simultâneos', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    mockUpdateFavoriteColors.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50)),
    );

    const { result } = renderHook(() => useColorimetryPreferences());
    await waitFor(() => expect(result.current.status).toBe('success'));

    const favorites = ['#111111', '#222222', '#333333', '#444444'];

    await act(async () => {
      result.current.saveFavoriteColors(favorites);
      await result.current.saveFavoriteColors(favorites);
    });

    expect(mockUpdateFavoriteColors).toHaveBeenCalledTimes(1);
  });

  it('atualiza preferences após salvamento bem-sucedido com resposta do servidor', async () => {
    const updatedPreferences = {
      ...MOCK_PREFERENCES,
      favoriteColors: ['#111111', '#222222', '#333333', '#444444'],
    };

    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    mockUpdateFavoriteColors.mockResolvedValueOnce(updatedPreferences);

    const { result } = renderHook(() => useColorimetryPreferences());
    await waitFor(() => expect(result.current.status).toBe('success'));

    await act(async () => {
      await result.current.saveFavoriteColors(updatedPreferences.favoriteColors);
    });

    expect(result.current.preferences!.favoriteColors).toEqual(updatedPreferences.favoriteColors);
  });

  it('mantém alterações locais quando salvamento falha', async () => {
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    mockUpdateFavoriteColors.mockRejectedValueOnce(new Error('Save error'));

    const { result } = renderHook(() => useColorimetryPreferences());
    await waitFor(() => expect(result.current.status).toBe('success'));

    const localFavorites = ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD'];

    await act(async () => {
      await result.current.saveFavoriteColors(localFavorites);
    });

    expect(result.current.saveError).not.toBeNull();
    expect(result.current.preferences!.favoriteColors).toEqual(MOCK_PREFERENCES.favoriteColors);
  });
});

describe('photo-triggered colorimetry', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches only after capture and keeps loading for four seconds', async () => {
    mockFetchPreferences.mockResolvedValue(MOCK_PREFERENCES);
    const { result, rerender } = renderHook(
      ({ enabled }) => useColorimetryPreferences(enabled, 4000),
      { initialProps: { enabled: false } },
    );
    expect(mockFetchPreferences).not.toHaveBeenCalled();
    rerender({ enabled: true });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3999);
    });
    expect(result.current.status).toBe('loading');
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1);
    });
    expect(result.current.preferences).toEqual(MOCK_PREFERENCES);
    expect(result.current.status).toBe('success');
  });

  it('waits for a slow backend and fetches a new palette after another photo', async () => {
    let resolveRequest!: (value: typeof MOCK_PREFERENCES) => void;
    mockFetchPreferences.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const { result, rerender } = renderHook(
      ({ enabled }) => useColorimetryPreferences(enabled, 4000),
      { initialProps: { enabled: true } },
    );
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
    expect(result.current.status).toBe('loading');
    await act(async () => resolveRequest(MOCK_PREFERENCES));
    expect(result.current.status).toBe('success');
    rerender({ enabled: false });
    const nextPalette = { ...MOCK_PREFERENCES, highlightColors: ['#123456'] };
    mockFetchPreferences.mockResolvedValueOnce(nextPalette);
    act(() => result.current.retry());
    rerender({ enabled: true });
    expect(result.current.status).toBe('loading');
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
    expect(result.current.preferences).toEqual(nextPalette);
  });

  it('allows retry after an API error and ignores responses after unmount', async () => {
    mockFetchPreferences.mockRejectedValueOnce(new Error('Offline'));
    const { result, unmount } = renderHook(() => useColorimetryPreferences(true, 4000));
    await act(async () => {});
    expect(result.current.status).toBe('error');
    mockFetchPreferences.mockResolvedValueOnce(MOCK_PREFERENCES);
    act(() => result.current.retry());
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
    expect(result.current.status).toBe('success');
    act(() => result.current.retry());
    unmount();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
  });
});

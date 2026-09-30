/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import * as preferencesApi from '@/api/preferences';
import { useColorimetryPreferences } from '@/hooks/UseColorimetryPreferences';

jest.mock('@/api/preferences');

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

  it('normaliza favoriteColors vazio para 4 slots placeholder', async () => {
    mockFetchPreferences.mockResolvedValueOnce({
      ...MOCK_PREFERENCES,
      favoriteColors: [],
    });

    const { result } = renderHook(() => useColorimetryPreferences());

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.preferences!.favoriteColors).toEqual([
      '#999999',
      '#999999',
      '#999999',
      '#999999',
    ]);
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

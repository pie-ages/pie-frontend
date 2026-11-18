import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';

import { useStorefrontFavoriteColors } from '@/hooks/UseStorefrontFavoriteColors';
import { fetchPreferences } from '@/services/preferences';

let mockAuth: { isAuthenticated: boolean; userId: string | null } = {
  isAuthenticated: true,
  userId: 'user-1',
};

jest.mock('@/contexts/AuthContext', () => ({ useAuth: () => mockAuth }));
jest.mock('@/services/preferences');
jest.mock('expo-router', () => {
  const { useEffect } = jest.requireActual<typeof import('react')>('react');
  return {
    useFocusEffect: (effect: Parameters<typeof useEffect>[0]) => useEffect(effect, [effect]),
  };
});

const mockFetchPreferences = jest.mocked(fetchPreferences);

beforeEach(() => {
  mockAuth = { isAuthenticated: true, userId: 'user-1' };
  mockFetchPreferences.mockReset();
});

describe('useStorefrontFavoriteColors', () => {
  it('loads favorites for the active account and clears them when preferences fail for another account', async () => {
    mockFetchPreferences.mockResolvedValueOnce({
      favoriteColors: ['#001F3F'],
      highlightColors: [],
      avoidColors: [],
    });
    mockFetchPreferences.mockRejectedValueOnce(new Error('offline'));

    const { result, rerender } = await renderHook(() => useStorefrontFavoriteColors());
    await waitFor(() => expect(result.current).toEqual(['#001F3F']));

    mockAuth = { isAuthenticated: true, userId: 'user-2' };
    await rerender(undefined);
    expect(result.current).toEqual([]);
    expect(mockFetchPreferences).toHaveBeenCalledTimes(2);
  });

  it('skips the preferences request for guests', async () => {
    mockAuth = { isAuthenticated: false, userId: null };

    const { result } = await renderHook(() => useStorefrontFavoriteColors());
    expect(result.current).toEqual([]);
    expect(mockFetchPreferences).not.toHaveBeenCalled();
  });
});

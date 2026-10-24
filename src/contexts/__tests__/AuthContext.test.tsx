import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as client from '@/services/client';
import * as storage from '@/utils/auth-storage';

jest.mock('@/services/client');
jest.mock('@/utils/auth-storage');

const mockApiPost = jest.mocked(client.apiPost);
const mockApiPostAuth = jest.mocked(client.apiPostAuth);
const mockStoreSession = jest.mocked(storage.storeSession);
const mockGetStoredToken = jest.mocked(storage.getStoredToken);
const mockGetStoredRefreshToken = jest.mocked(storage.getStoredRefreshToken);
const mockGetStoredExpiresAt = jest.mocked(storage.getStoredExpiresAt);
const mockClearSession = jest.mocked(storage.clearSession);

const validSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: 3600,
  tokenType: 'bearer',
  user: { id: 'uid-1', name: 'Anna', email: 'anna@pie.com.br', photoUrl: null },
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetStoredToken.mockResolvedValue(null);
  mockGetStoredRefreshToken.mockResolvedValue(null);
  mockGetStoredExpiresAt.mockResolvedValue(null);
});

describe('AuthContext — init', () => {
  it('starts unauthenticated when no token stored', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isInitializing).toBe(false);
  });

  it('restores session from a valid stored token', async () => {
    mockGetStoredToken.mockResolvedValue('access-token');
    mockGetStoredExpiresAt.mockResolvedValue(Date.now() + 3_600_000);

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('refreshes an expired token on init', async () => {
    mockGetStoredToken.mockResolvedValue('old-access');
    mockGetStoredExpiresAt.mockResolvedValue(Date.now() - 1000);
    mockGetStoredRefreshToken.mockResolvedValue('refresh-token');
    mockApiPost.mockResolvedValue(validSession);
    mockStoreSession.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {});

    expect(mockApiPost).toHaveBeenCalledWith('/api/auth/refresh', {
      refreshToken: 'refresh-token',
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears session when refresh fails on init', async () => {
    mockGetStoredToken.mockResolvedValue('old-access');
    mockGetStoredExpiresAt.mockResolvedValue(Date.now() - 1000);
    mockGetStoredRefreshToken.mockResolvedValue('bad-refresh');
    mockApiPost.mockRejectedValue(new Error('401'));

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {});

    expect(mockClearSession).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('AuthContext — signIn', () => {
  it('stores session and sets authenticated on success', async () => {
    mockApiPost.mockResolvedValue(validSession);
    mockStoreSession.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    await act(async () => {
      await result.current.signIn({ email: 'anna@pie.com.br', password: '123456' });
    });

    expect(mockStoreSession).toHaveBeenCalledWith(
      validSession.accessToken,
      validSession.refreshToken,
      validSession.expiresIn,
    );
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(validSession.user);
  });

  it('throws on invalid credentials', async () => {
    mockApiPost.mockRejectedValue(
      new client.ApiError('Credenciais inválidas', 401, 'Invalid credentials'),
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let thrownError: unknown;
    await act(async () => {
      try {
        await result.current.signIn({ email: 'wrong@pie.com.br', password: 'bad' });
      } catch (e) {
        thrownError = e;
      }
    });
    expect(thrownError).toBeInstanceOf(client.ApiError);
  });
});

describe('AuthContext — signOut', () => {
  it('clears auth state and calls backend logout', async () => {
    mockGetStoredToken.mockResolvedValue('access-token');
    mockGetStoredExpiresAt.mockResolvedValue(Date.now() + 3_600_000);
    mockApiPostAuth.mockResolvedValue(undefined);
    mockClearSession.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(mockClearSession).toHaveBeenCalled();
  });
});

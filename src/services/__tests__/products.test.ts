import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/services/client';
import { fetchCatalog } from '@/services/products';
import { getStoredToken } from '@/utils/auth-storage';

jest.mock('@/utils/auth-storage');

const mockGetStoredToken = jest.mocked(getStoredToken);
const mockFetch = jest.fn<typeof fetch>();
const originalFetch = globalThis.fetch;
const page = { items: [], total: 0, page: 0, size: 20, ignoredFilters: [] };

function response(status: number, body: unknown): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockReset();
  globalThis.fetch = mockFetch as typeof fetch;
  mockGetStoredToken.mockResolvedValue('user-session-token');
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('fetchCatalog authentication', () => {
  it('sends the user session on the initial Vitrine request without profile filters', async () => {
    mockFetch.mockResolvedValue(response(200, page));

    await expect(fetchCatalog()).resolves.toEqual(page);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/products?page=0&size=20&sort=name%2CASC'),
      expect.objectContaining({ headers: { Authorization: 'Bearer user-session-token' } }),
    );
  });

  it('keeps the catalog accessible when no session is stored', async () => {
    mockGetStoredToken.mockResolvedValue(null);
    mockFetch.mockResolvedValue(response(200, page));

    await expect(fetchCatalog()).resolves.toEqual(page);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: {} }),
    );
  });

  it('retries anonymously after a rejected session and preserves the requested page', async () => {
    const nextPage = { ...page, page: 1, size: 5 };
    mockFetch.mockResolvedValueOnce(response(401, { message: 'Sessão expirada' }));
    mockFetch.mockResolvedValueOnce(response(200, nextPage));

    await expect(fetchCatalog({ page: 1, size: 5 })).resolves.toEqual(nextPage);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/api/products?page=1&size=5&sort=name%2CASC'),
      expect.objectContaining({ headers: {} }),
    );
  });

  it('surfaces server failures without silently replacing the authenticated response', async () => {
    mockFetch.mockResolvedValue(response(500, { message: 'Erro interno' }));

    await expect(fetchCatalog()).rejects.toBeInstanceOf(ApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

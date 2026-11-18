import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useWardrobeProductIds } from '@/hooks/UseWardrobeProductIds';
import * as wardrobe from '@/services/wardrobe';

type FocusEffect = () => void | (() => void);

let mockFocusEffect: FocusEffect | null = null;
let mockCleanup: (() => void) | void;

jest.mock('expo-router', () => ({
  useFocusEffect: (effect: FocusEffect) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react').useEffect(() => {
      mockFocusEffect = effect;
      mockCleanup = effect();
      return () => mockCleanup?.();
    }, [effect]);
  },
}));
jest.mock('@/services/wardrobe');

const mockFetchIds = jest.mocked(wardrobe.fetchWardrobeProductIds);

async function focusAgain() {
  await act(async () => {
    mockCleanup?.();
    mockCleanup = mockFocusEffect?.();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFocusEffect = null;
  mockCleanup = undefined;
});

describe('useWardrobeProductIds', () => {
  it('returns the products that are in the closet', async () => {
    mockFetchIds.mockResolvedValue(new Set(['prod-1']));

    const { result } = await renderHook(() => useWardrobeProductIds());
    await act(async () => {});

    expect(result.current.has('prod-1')).toBe(true);
    expect(result.current.has('prod-2')).toBe(false);
  });

  it('starts empty while the closet is loading', async () => {
    mockFetchIds.mockReturnValue(new Promise(() => {}));

    const { result } = await renderHook(() => useWardrobeProductIds());

    expect(result.current.size).toBe(0);
  });

  it('reloads the closet when the screen is focused again', async () => {
    mockFetchIds.mockResolvedValueOnce(new Set(['prod-1']));
    const { result } = await renderHook(() => useWardrobeProductIds());
    await act(async () => {});

    mockFetchIds.mockResolvedValueOnce(new Set(['prod-1', 'prod-2']));
    await focusAgain();
    expect(result.current.has('prod-2')).toBe(true);

    mockFetchIds.mockResolvedValueOnce(new Set(['prod-2']));
    await focusAgain();
    expect(result.current.has('prod-1')).toBe(false);
    expect(mockFetchIds).toHaveBeenCalledTimes(3);
  });

  it('keeps the last known closet when reloading fails', async () => {
    mockFetchIds.mockResolvedValueOnce(new Set(['prod-1']));
    const { result } = await renderHook(() => useWardrobeProductIds());
    await act(async () => {});

    mockFetchIds.mockRejectedValueOnce(new Error('offline'));
    await focusAgain();

    expect(result.current.has('prod-1')).toBe(true);
  });
});

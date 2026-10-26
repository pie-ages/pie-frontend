import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useStorefrontNotice } from '@/hooks/UseStorefrontNotice';

let mockParams: Record<string, string | undefined> = {};
const mockSetParams = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  router: { setParams: (...args: unknown[]) => mockSetParams(...args) },
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockParams = {};
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useStorefrontNotice', () => {
  it('has no notice when nothing was done on the previous screen', async () => {
    const { result } = await renderHook(() => useStorefrontNotice());

    expect(result.current.message).toBeNull();
    expect(mockSetParams).not.toHaveBeenCalled();
  });

  it('shows the notice received from the previous screen', async () => {
    mockParams = { notice: 'Blusa adicionada ao seu closet!' };

    const { result } = await renderHook(() => useStorefrontNotice());

    expect(result.current.message).toBe('Blusa adicionada ao seu closet!');
  });

  it('clears the route param so the notice does not come back on the next visit', async () => {
    mockParams = { notice: 'Blusa adicionada ao seu closet!' };

    await renderHook(() => useStorefrontNotice());

    expect(mockSetParams).toHaveBeenCalledWith({ notice: undefined });
  });

  it('hides the notice after a few seconds', async () => {
    mockParams = { notice: 'Blusa adicionada ao seu closet!' };
    const { result } = await renderHook(() => useStorefrontNotice());

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.message).toBeNull();
  });
});

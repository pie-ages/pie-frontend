import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, renderHook } from '@testing-library/react-native';
import { useEffect, type PropsWithChildren } from 'react';
import type { ViewInstance } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import { useOnboardingTarget } from '@/hooks/UseOnboardingTarget';
import type { OnboardingTargetId } from '@/types/Onboarding';
import * as storage from '@/utils/onboarding-storage';

jest.mock('@/contexts/AuthContext');
jest.mock('@/utils/onboarding-storage');

const mockUseAuth = jest.mocked(useAuth);
const mockGetProgress = jest.mocked(storage.getStoredOnboardingProgress);

const renderSpotlight = () => null;

function wrapper({ children }: PropsWithChildren) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

function createNode(frame: [number, number, number, number]) {
  return {
    measureInWindow: (callback: (x: number, y: number, w: number, h: number) => void) =>
      callback(...frame),
  } as unknown as ViewInstance;
}

async function renderTarget(id: OnboardingTargetId | undefined) {
  const hook = await renderHook(
    () => ({
      target: useOnboardingTarget(id, renderSpotlight),
      onboarding: useOnboarding(),
    }),
    { wrapper },
  );
  await act(async () => {});
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ userId: 'user-1', pendingStyleQuiz: false } as ReturnType<
    typeof useAuth
  >);
  mockGetProgress.mockResolvedValue(null);
});

describe('useOnboardingTarget', () => {
  it('registra a posição do elemento medida na janela', async () => {
    const { result } = await renderTarget('filters');

    await act(async () => result.current.target.setTargetNode(createNode([12, 34, 200, 48])));

    expect(result.current.onboarding.targets.filters?.rect).toEqual({
      x: 12,
      y: 34,
      width: 200,
      height: 48,
    });
  });

  it('ignora medidas com largura e altura zeradas', async () => {
    const { result } = await renderTarget('profile');

    await act(async () => result.current.target.setTargetNode(createNode([0, 0, 0, 0])));

    expect(result.current.onboarding.targets.profile).toBeUndefined();
  });

  it('não registra nada quando o elemento não tem identificador de onboarding', async () => {
    const { result } = await renderTarget(undefined);

    await act(async () => result.current.target.setTargetNode(createNode([1, 2, 3, 4])));

    expect(result.current.onboarding.targets).toEqual({});
  });

  it('não registra quando o onboarding já foi concluído', async () => {
    mockGetProgress.mockResolvedValue(JSON.stringify({ status: 'completed', stepIndex: 0 }));
    const { result } = await renderTarget('wishlist');

    await act(async () => result.current.target.setTargetNode(createNode([1, 2, 3, 4])));

    expect(result.current.onboarding.targets.wishlist).toBeUndefined();
  });

  it('mede de novo quando o onLayout é chamado', async () => {
    const { result } = await renderTarget('wishlist');
    await act(async () => result.current.target.setTargetNode(createNode([1, 2, 3, 4])));

    await act(async () => result.current.target.onLayout());

    expect(result.current.onboarding.targets.wishlist?.rect).toEqual({
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    });
  });

  it('remove o alvo quando o elemento sai da tela', async () => {
    let onboarding!: ReturnType<typeof useOnboarding>;

    function Reader() {
      onboarding = useOnboarding();
      return null;
    }

    function Target() {
      const { setTargetNode } = useOnboardingTarget('filters', renderSpotlight);
      useEffect(() => setTargetNode(createNode([1, 2, 3, 4])), [setTargetNode]);
      return null;
    }

    const tree = (showTarget: boolean) => (
      <OnboardingProvider>
        <Reader />
        {showTarget && <Target />}
      </OnboardingProvider>
    );

    const { rerender } = await render(tree(true));
    await act(async () => {});
    expect(onboarding.targets.filters).toBeDefined();

    await rerender(tree(false));
    await act(async () => {});

    expect(onboarding.targets.filters).toBeUndefined();
  });
});

describe('useOnboardingTarget — sem OnboardingProvider', () => {
  it('não quebra e não registra nada', async () => {
    const { result } = await renderHook(() => useOnboardingTarget('filters', renderSpotlight));

    await act(async () => result.current.setTargetNode(createNode([1, 2, 3, 4])));

    expect(() => result.current.onLayout()).not.toThrow();
  });
});

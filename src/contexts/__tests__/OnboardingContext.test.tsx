import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { ONBOARDING_STEPS } from '@/constants/OnboardingSteps';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import * as storage from '@/utils/onboarding-storage';

jest.mock('@/contexts/AuthContext');
jest.mock('@/utils/onboarding-storage');

const mockUseAuth = jest.mocked(useAuth);
const mockGetProgress = jest.mocked(storage.getStoredOnboardingProgress);
const mockStoreProgress = jest.mocked(storage.storeOnboardingProgress);

const LAST_STEP = ONBOARDING_STEPS.length - 1;

function setAuth(userId: string | null, pendingStyleQuiz = false) {
  mockUseAuth.mockReturnValue({ userId, pendingStyleQuiz } as ReturnType<typeof useAuth>);
}

function wrapper({ children }: PropsWithChildren) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

async function renderOnboarding() {
  const hook = await renderHook(() => useOnboarding(), { wrapper });
  await act(async () => {});
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  setAuth('user-1');
  mockGetProgress.mockResolvedValue(null);
  mockStoreProgress.mockResolvedValue(undefined);
});

describe('OnboardingContext — carregamento', () => {
  it('mostra o onboarding desde o primeiro passo para um usuário sem progresso salvo', async () => {
    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(true);
    expect(result.current.stepIndex).toBe(0);
    expect(mockGetProgress).toHaveBeenCalledWith('user-1');
  });

  it('retoma o passo salvo do usuário', async () => {
    mockGetProgress.mockResolvedValue(JSON.stringify({ status: 'in_progress', stepIndex: 3 }));

    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(true);
    expect(result.current.stepIndex).toBe(3);
  });

  it('não mostra o onboarding quando o usuário já o concluiu', async () => {
    mockGetProgress.mockResolvedValue(JSON.stringify({ status: 'completed', stepIndex: 0 }));

    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(false);
  });

  it('não mostra o onboarding sem usuário identificado', async () => {
    setAuth(null);

    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(false);
    expect(mockGetProgress).not.toHaveBeenCalled();
  });

  it('espera o questionário de estilo terminar antes de mostrar', async () => {
    setAuth('user-1', true);

    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(false);
  });

  it('começa do primeiro passo quando a leitura do progresso falha', async () => {
    mockGetProgress.mockRejectedValue(new Error('storage indisponível'));

    const { result } = await renderOnboarding();

    expect(result.current.isVisible).toBe(true);
    expect(result.current.stepIndex).toBe(0);
  });

  it('usa o progresso de cada usuário ao trocar de conta', async () => {
    mockGetProgress.mockImplementation(async (userId) =>
      userId === 'user-1' ? JSON.stringify({ status: 'completed', stepIndex: 0 }) : null,
    );

    const { result, rerender } = await renderHook(() => useOnboarding(), { wrapper });
    await act(async () => {});
    expect(result.current.isVisible).toBe(false);

    setAuth('user-2');
    await rerender({});
    await act(async () => {});

    expect(mockGetProgress).toHaveBeenCalledWith('user-2');
    expect(result.current.isVisible).toBe(true);
    expect(result.current.stepIndex).toBe(0);
  });
});

describe('OnboardingContext — navegação e progresso', () => {
  it('avança de passo e salva o progresso do usuário', async () => {
    const { result } = await renderOnboarding();

    await act(async () => result.current.goToStep(2));

    expect(result.current.stepIndex).toBe(2);
    expect(mockStoreProgress).toHaveBeenCalledWith('user-1', {
      status: 'in_progress',
      stepIndex: 2,
    });
  });

  it('limita o passo ao primeiro e ao último', async () => {
    const { result } = await renderOnboarding();

    await act(async () => result.current.goToStep(-4));
    expect(result.current.stepIndex).toBe(0);

    await act(async () => result.current.goToStep(99));
    expect(result.current.stepIndex).toBe(LAST_STEP);
  });

  it('conclui o onboarding, esconde e salva como concluído', async () => {
    const { result } = await renderOnboarding();

    await act(async () => result.current.complete());

    expect(result.current.isVisible).toBe(false);
    expect(mockStoreProgress).toHaveBeenCalledWith('user-1', {
      status: 'completed',
      stepIndex: 0,
    });
  });

  it('mantém o progresso em memória quando salvar falha', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockStoreProgress.mockRejectedValue(new Error('sem espaço'));
    const { result } = await renderOnboarding();

    await act(async () => result.current.goToStep(1));

    expect(result.current.stepIndex).toBe(1);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('OnboardingContext — alvos de destaque', () => {
  const rect = { x: 10, y: 20, width: 30, height: 40 };

  it('registra e remove um alvo', async () => {
    const { result } = await renderOnboarding();
    const renderSpotlight = () => null;

    await act(async () => result.current.registerTarget('filters', { rect, renderSpotlight }));
    expect(result.current.targets.filters?.rect).toEqual(rect);

    await act(async () => result.current.unregisterTarget('filters'));
    expect(result.current.targets.filters).toBeUndefined();
  });

  it('não recria o estado quando o alvo registrado é idêntico', async () => {
    const { result } = await renderOnboarding();
    const renderSpotlight = () => null;

    await act(async () => result.current.registerTarget('profile', { rect, renderSpotlight }));
    const before = result.current.targets;
    await act(async () =>
      result.current.registerTarget('profile', { rect: { ...rect }, renderSpotlight }),
    );

    expect(result.current.targets).toBe(before);
  });
});

describe('useOnboarding', () => {
  it('lança erro fora do OnboardingProvider', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(renderHook(() => useOnboarding())).rejects.toThrow(
      'useOnboarding must be used within OnboardingProvider',
    );

    consoleError.mockRestore();
  });
});

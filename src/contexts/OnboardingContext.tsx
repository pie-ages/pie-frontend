import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import { ONBOARDING_STEPS } from '@/constants/OnboardingSteps';
import { useAuth } from '@/contexts/AuthContext';
import type {
  OnboardingProgress,
  OnboardingTargetId,
  OnboardingTargetRect,
} from '@/types/Onboarding';
import { INITIAL_ONBOARDING_PROGRESS, parseOnboardingProgress } from '@/utils/onboarding-progress';
import { getStoredOnboardingProgress, storeOnboardingProgress } from '@/utils/onboarding-storage';

export type OnboardingTarget = {
  rect: OnboardingTargetRect;
  renderSpotlight: () => ReactNode;
};

type OnboardingContextValue = {
  isVisible: boolean;
  stepIndex: number;
  goToStep: (index: number) => void;
  complete: () => void;
  targets: Partial<Record<OnboardingTargetId, OnboardingTarget>>;
  registerTarget: (id: OnboardingTargetId, target: OnboardingTarget) => void;
  unregisterTarget: (id: OnboardingTargetId) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function isSameRect(a: OnboardingTargetRect, b: OnboardingTargetRect) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

export function OnboardingProvider({ children }: PropsWithChildren) {
  const { userId, pendingStyleQuiz } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; progress: OnboardingProgress } | null>(
    null,
  );
  const [targets, setTargets] = useState<OnboardingContextValue['targets']>({});

  const progress = loaded && loaded.userId === userId ? loaded.progress : null;

  useEffect(() => {
    if (!userId) return;

    let isActive = true;

    getStoredOnboardingProgress(userId)
      .then((raw) => {
        if (isActive) {
          setLoaded({ userId, progress: parseOnboardingProgress(raw, ONBOARDING_STEPS.length) });
        }
      })
      .catch(() => {
        if (isActive) setLoaded({ userId, progress: INITIAL_ONBOARDING_PROGRESS });
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const saveProgress = useCallback(
    (next: OnboardingProgress) => {
      if (!userId) return;

      setLoaded({ userId, progress: next });
      storeOnboardingProgress(userId, next).catch((error) => {
        console.error('Erro ao salvar progresso do onboarding:', error);
      });
    },
    [userId],
  );

  const goToStep = useCallback(
    (index: number) => {
      const lastIndex = ONBOARDING_STEPS.length - 1;
      saveProgress({ status: 'in_progress', stepIndex: Math.min(Math.max(index, 0), lastIndex) });
    },
    [saveProgress],
  );

  const complete = useCallback(() => {
    saveProgress({ status: 'completed', stepIndex: 0 });
  }, [saveProgress]);

  const registerTarget = useCallback((id: OnboardingTargetId, target: OnboardingTarget) => {
    setTargets((current) => {
      const previous = current[id];
      if (
        previous &&
        previous.renderSpotlight === target.renderSpotlight &&
        isSameRect(previous.rect, target.rect)
      ) {
        return current;
      }
      return { ...current, [id]: target };
    });
  }, []);

  const unregisterTarget = useCallback((id: OnboardingTargetId) => {
    setTargets((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      isVisible: progress?.status === 'in_progress' && !pendingStyleQuiz,
      stepIndex: progress?.stepIndex ?? 0,
      goToStep,
      complete,
      targets,
      registerTarget,
      unregisterTarget,
    }),
    [progress, pendingStyleQuiz, goToStep, complete, targets, registerTarget, unregisterTarget],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

export function useOptionalOnboarding() {
  return useContext(OnboardingContext);
}

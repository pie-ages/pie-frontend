import type { OnboardingProgress } from '@/types/Onboarding';

export function getOnboardingStorageKey(userId: string): string {
  return `pie_onboarding_progress.${userId.replace(/[^A-Za-z0-9._-]/g, '_')}`;
}

export const INITIAL_ONBOARDING_PROGRESS: OnboardingProgress = {
  status: 'in_progress',
  stepIndex: 0,
};

export function parseOnboardingProgress(raw: string | null, stepCount: number): OnboardingProgress {
  if (!raw) return INITIAL_ONBOARDING_PROGRESS;

  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return INITIAL_ONBOARDING_PROGRESS;

    const { status, stepIndex } = value as Record<string, unknown>;
    if (status === 'completed') return { status, stepIndex: 0 };
    if (status !== 'in_progress' || typeof stepIndex !== 'number') {
      return INITIAL_ONBOARDING_PROGRESS;
    }

    const lastIndex = Math.max(stepCount - 1, 0);
    return { status, stepIndex: Math.min(Math.max(Math.floor(stepIndex), 0), lastIndex) };
  } catch {
    return INITIAL_ONBOARDING_PROGRESS;
  }
}

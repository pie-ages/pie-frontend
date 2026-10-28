export type OnboardingTargetId = 'filters' | 'profile' | 'wishlist';

export type OnboardingHighlight = { type: 'tab'; index: number } | { type: OnboardingTargetId };

export type OnboardingTooltipPlacement = 'top' | 'bottom';

export type OnboardingTooltipAlign = 'center' | 'end';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  nextLabel: string;
  highlight: OnboardingHighlight;
  placement: OnboardingTooltipPlacement;
  align?: OnboardingTooltipAlign;
};

export type OnboardingProgress = {
  status: 'in_progress' | 'completed';
  stepIndex: number;
};

export type OnboardingTargetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

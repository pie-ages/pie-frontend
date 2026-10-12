export type OnboardingHighlight =
  { type: 'tab'; index: number } | { type: 'filters' } | { type: 'profile' } | { type: 'wishlist' };

export type OnboardingTooltipPlacement = 'top' | 'bottom';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  nextLabel: string;
  highlight: OnboardingHighlight;
  placement: OnboardingTooltipPlacement;
};

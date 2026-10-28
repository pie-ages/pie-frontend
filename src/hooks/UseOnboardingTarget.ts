import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { View } from 'react-native';

import { useOptionalOnboarding } from '@/contexts/OnboardingContext';
import type { OnboardingTargetId } from '@/types/Onboarding';

export function useOnboardingTarget(
  id: OnboardingTargetId | undefined,
  renderSpotlight: () => ReactNode,
) {
  const onboarding = useOptionalOnboarding();
  const [node, setTargetNode] = useState<View | null>(null);

  const registerTarget = onboarding?.registerTarget;
  const unregisterTarget = onboarding?.unregisterTarget;
  const isActive = Boolean(id && onboarding?.isVisible);

  const measure = useCallback(() => {
    if (!id || !registerTarget || !isActive || !node) return;

    node.measureInWindow((x, y, width, height) => {
      if (width === 0 && height === 0) return;
      registerTarget(id, { rect: { x, y, width, height }, renderSpotlight });
    });
  }, [id, registerTarget, isActive, node, renderSpotlight]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (!id || !unregisterTarget) return;
    return () => unregisterTarget(id);
  }, [id, unregisterTarget]);

  return { setTargetNode, onLayout: measure };
}

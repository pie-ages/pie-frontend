import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState, type RefObject } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarSpotlight } from '@/components/BottomTabBar';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { ONBOARDING_STEPS } from '@/constants/OnboardingSteps';
import { Colors, Spacing } from '@/constants/Theme';

import { styles } from './styles';

type OnboardingOverlayProps = {
  onSkip: () => void;
  blurTarget?: RefObject<View | null>;
};

const BLUR_INTENSITY = 20;
const IMPLEMENTED_STEPS = ONBOARDING_STEPS.slice(0, 2);

const TAB_SPOTLIGHTS = [
  { label: 'Vitrine', icon: 'hanger', iconSet: 'material-community' },
  { label: 'Closet', icon: 'wardrobe-outline', iconSet: 'material-community' },
] as const;

export function OnboardingOverlay({ onSkip, blurTarget }: OnboardingOverlayProps) {
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);

  const step = IMPLEMENTED_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastImplementedStep = stepIndex === IMPLEMENTED_STEPS.length - 1;
  const tabSpotlight = step.highlight.type === 'tab' ? TAB_SPOTLIGHTS[step.highlight.index] : null;

  const webStyle =
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        } as object)
      : undefined;

  return (
    <View style={styles.overlay}>
      {Platform.OS === 'web' ? (
        <View style={[styles.dim, webStyle]} />
      ) : (
        <BlurView
          intensity={BLUR_INTENSITY}
          tint="dark"
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget}
          style={styles.blur}
        >
          <View style={styles.dim} />
        </BlurView>
      )}

      {tabSpotlight && step.highlight.type === 'tab' && (
        <TabBarSpotlight index={step.highlight.index} tabCount={3} {...tabSpotlight} />
      )}

      <Pressable
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Pular onboarding"
        hitSlop={Spacing.three}
        style={({ pressed }) => [
          styles.skipButton,
          { top: insets.top + Spacing.two },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.skipLabel}>Pular</Text>
        <Ionicons name="chevron-forward" size={18} color={Colors.white} />
      </Pressable>

      <OnboardingTooltip
        key={step.id}
        stepLabel={`Passo ${stepIndex + 1} de ${ONBOARDING_STEPS.length}`}
        title={step.title}
        description={step.description}
        backLabel={isFirstStep ? undefined : '← Voltar'}
        nextLabel={step.nextLabel}
        onBack={isFirstStep ? undefined : () => setStepIndex((current) => current - 1)}
        onNext={isLastImplementedStep ? undefined : () => setStepIndex((current) => current + 1)}
      />
    </View>
  );
}

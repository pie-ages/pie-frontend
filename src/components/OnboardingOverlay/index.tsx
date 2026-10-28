import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { type RefObject } from 'react';
import { Platform, Pressable, Text, View, type ViewInstance } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarSpotlight } from '@/components/BottomTabBar';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { ONBOARDING_STEPS } from '@/constants/OnboardingSteps';
import { Colors, Spacing } from '@/constants/Theme';
import { useOnboarding } from '@/contexts/OnboardingContext';

import { styles } from './styles';

type OnboardingOverlayProps = {
  onFinish: () => void;
  blurTarget?: RefObject<ViewInstance | null>;
};

const BLUR_INTENSITY = 20;

const TAB_SPOTLIGHTS = [
  { label: 'Vitrine', icon: 'hanger', iconSet: 'material-community' },
  { label: 'Closet', icon: 'wardrobe-outline', iconSet: 'material-community' },
  { label: 'Looks', icon: 'sparkles-outline', iconSet: 'ionicons' },
] as const;

export function OnboardingOverlay({ onFinish, blurTarget }: OnboardingOverlayProps) {
  const insets = useSafeAreaInsets();
  const { stepIndex, goToStep, complete, targets } = useOnboarding();

  const step = ONBOARDING_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;
  const tabSpotlight = step.highlight.type === 'tab' ? TAB_SPOTLIGHTS[step.highlight.index] : null;
  const target = step.highlight.type === 'tab' ? undefined : targets[step.highlight.type];
  const isSkipOnLeft = Boolean(target) && step.align === 'end';

  const finish = () => {
    complete();
    onFinish();
  };

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

      {target && (
        <Animated.View
          key={`spotlight-${step.id}`}
          pointerEvents="none"
          entering={FadeIn.duration(250).reduceMotion(ReduceMotion.System)}
          style={[
            styles.targetSpotlight,
            {
              left: target.rect.x,
              top: target.rect.y,
              width: target.rect.width,
              height: target.rect.height,
            },
          ]}
        >
          {target.renderSpotlight()}
        </Animated.View>
      )}

      <Pressable
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel="Pular onboarding"
        hitSlop={Spacing.three}
        style={({ pressed }) => [
          styles.skipButton,
          isSkipOnLeft ? styles.skipButtonLeft : styles.skipButtonRight,
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
        onBack={isFirstStep ? undefined : () => goToStep(stepIndex - 1)}
        onNext={isLastStep ? finish : () => goToStep(stepIndex + 1)}
        anchor={
          step.placement === 'top' && target
            ? {
                top:
                  target.rect.y +
                  target.rect.height +
                  (step.align === 'end' ? Spacing.two : Spacing.three),
                align: step.align ?? 'center',
              }
            : undefined
        }
      />
    </View>
  );
}

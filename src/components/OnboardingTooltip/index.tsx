import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Keyframe, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing } from '@/constants/Theme';
import type { OnboardingTooltipAlign } from '@/types/Onboarding';

import { styles } from './styles';

type OnboardingTooltipProps = {
  stepLabel?: string;
  title?: string;
  description?: string;
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  anchor?: { top: number; align: OnboardingTooltipAlign };
  style?: StyleProp<ViewStyle>;
};

const STEP_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 8 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
})
  .duration(600)
  .reduceMotion(ReduceMotion.System);

export function OnboardingTooltip({
  stepLabel,
  title,
  description,
  backLabel,
  nextLabel,
  onBack,
  onNext,
  anchor,
  style,
}: OnboardingTooltipProps) {
  const insets = useSafeAreaInsets();

  const positionStyle: StyleProp<ViewStyle> = anchor
    ? [{ top: anchor.top }, anchor.align === 'end' && styles.cardEnd]
    : { bottom: insets.bottom + BottomTabInset + Spacing.three };

  return (
    <Animated.View entering={STEP_ENTERING} style={[styles.card, positionStyle, style]}>
      <View style={styles.header}>
        <View style={styles.badge}>
          {stepLabel ? <Text style={styles.badgeLabel}>{stepLabel}</Text> : null}
        </View>
      </View>

      <View style={styles.titleContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      <View style={styles.descriptionContainer}>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          accessibilityRole="button"
          hitSlop={Spacing.two}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          {backLabel ? <Text style={styles.backLabel}>{backLabel}</Text> : null}
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!onNext}
          accessibilityRole="button"
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        >
          {nextLabel ? <Text style={styles.nextLabel}>{nextLabel}</Text> : null}
        </Pressable>
      </View>
    </Animated.View>
  );
}

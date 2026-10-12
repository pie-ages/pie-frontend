import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing } from '@/constants/Theme';

import { styles } from './styles';

type OnboardingTooltipProps = {
  stepLabel?: string;
  title?: string;
  description?: string;
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function OnboardingTooltip({
  stepLabel,
  title,
  description,
  backLabel,
  nextLabel,
  onBack,
  onNext,
  style,
}: OnboardingTooltipProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.card, { bottom: insets.bottom + BottomTabInset + Spacing.three }, style]}>
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
    </View>
  );
}

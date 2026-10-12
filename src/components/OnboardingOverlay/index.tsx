import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { RefObject } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarSpotlight } from '@/components/BottomTabBar';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { Colors, Spacing } from '@/constants/Theme';

import { styles } from './styles';

type OnboardingOverlayProps = {
  onSkip: () => void;
  blurTarget?: RefObject<View | null>;
};

const BLUR_INTENSITY = 20;

export function OnboardingOverlay({ onSkip, blurTarget }: OnboardingOverlayProps) {
  const insets = useSafeAreaInsets();

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

      <TabBarSpotlight
        index={0}
        tabCount={3}
        label="Vitrine"
        icon="hanger"
        iconSet="material-community"
      />

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

      <OnboardingTooltip />
    </View>
  );
}

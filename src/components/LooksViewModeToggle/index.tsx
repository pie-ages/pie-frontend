import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { LooksViewMode } from '@/types/Look';

import { styles } from './styles';

const OPTIONS: { value: LooksViewMode; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'focus', label: 'Foco' },
];

const CONTAINER_PADDING = 2;

type LooksViewModeToggleProps = {
  value: LooksViewMode;
  onChange: (value: LooksViewMode) => void;
};

export function LooksViewModeToggle({ value, onChange }: LooksViewModeToggleProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = OPTIONS.findIndex((option) => option.value === value);
  const progress = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  useEffect(() => {
    const nextIndex = OPTIONS.findIndex((option) => option.value === value);
    if (nextIndex >= 0) {
      progress.value = withTiming(nextIndex, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [progress, value]);

  const segmentWidth =
    containerWidth > 0 ? (containerWidth - CONTAINER_PADDING * 2) / OPTIONS.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * segmentWidth }],
  }));

  return (
    <View
      style={styles.container}
      accessibilityRole="tablist"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, { width: segmentWidth }, indicatorStyle]}
        />
      )}
      {OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, segmentWidth === 0 && isSelected && styles.segmentSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

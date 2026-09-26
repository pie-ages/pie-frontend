import { Pressable, Text, View } from 'react-native';

import type { LooksViewMode } from '@/types/look';

import { styles } from './styles';

const OPTIONS: { value: LooksViewMode; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'focus', label: 'Foco' },
];

type LooksViewModeToggleProps = {
  value: LooksViewMode;
  onChange: (value: LooksViewMode) => void;
};

export function LooksViewModeToggle({ value, onChange }: LooksViewModeToggleProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isSelected && styles.segmentSelected]}
          >
            <Text style={styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

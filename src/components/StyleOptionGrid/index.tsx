import { View } from 'react-native';

import { StyleOptionCard } from '@/components/StyleOptionCard';
import type { FilterOption } from '@/types/Filter';

import { styles } from './styles';

type StyleOptionGridProps = {
  options: FilterOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

export function StyleOptionGrid({ options, selectedIds, onToggle }: StyleOptionGridProps) {
  return (
    <View style={styles.grid}>
      {options.map((option) => (
        <StyleOptionCard
          key={option.id}
          label={option.label}
          isSelected={selectedIds.has(option.id)}
          onPress={() => onToggle(option.id)}
        />
      ))}
    </View>
  );
}

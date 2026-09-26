import { View } from 'react-native';

import { StyleOptionCard } from '@/components/StyleOptionCard';
import type { FilterOption } from '@/types/Filter';

import { styles } from './styles';

const COLUMNS = 3;

type StyleOptionGridProps = {
  options: FilterOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

export function StyleOptionGrid({ options, selectedIds, onToggle }: StyleOptionGridProps) {
  const rows: FilterOption[][] = [];
  for (let i = 0; i < options.length; i += COLUMNS) {
    rows.push(options.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.content}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((option) => (
            <StyleOptionCard
              key={option.id}
              label={option.label}
              isSelected={selectedIds.has(option.id)}
              onPress={() => onToggle(option.id)}
            />
          ))}
          {row.length < COLUMNS &&
            Array.from({ length: COLUMNS - row.length }).map((_, index) => (
              <View key={`placeholder-${index}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}

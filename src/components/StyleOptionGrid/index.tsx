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
  const rows: FilterOption[][] = [];
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2));

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((option) => (
            <StyleOptionCard
              key={option.id}
              label={option.label}
              isSelected={selectedIds.has(option.id)}
              onPress={() => onToggle(option.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

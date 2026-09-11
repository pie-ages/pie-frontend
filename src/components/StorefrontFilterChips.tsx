import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { MOCK_FILTERS } from '@/mocks/Products';

type StorefrontFilterChipsProps = {
  onSelect?: (filterId: string) => void;
};

export function StorefrontFilterChips({ onSelect }: StorefrontFilterChipsProps) {
  const [selectedId, setSelectedId] = useState(MOCK_FILTERS[0].id);

  function handleSelect(filterId: string) {
    setSelectedId(filterId);
    onSelect?.(filterId);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {MOCK_FILTERS.map((filter) => {
        const isSelected = filter.id === selectedId;

        return (
          <Pressable
            key={filter.id}
            onPress={() => handleSelect(filter.id)}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipDefault,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelDefault]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    height: 30,
    paddingHorizontal: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDefault: {
    backgroundColor: '#FDE2D9',
  },
  chipSelected: {
    backgroundColor: '#661414',
  },
  chipPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelDefault: {
    color: '#000',
  },
  labelSelected: {
    color: '#FFF',
  },
});

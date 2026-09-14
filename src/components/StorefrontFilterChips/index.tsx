import { Pressable, ScrollView, Text } from 'react-native';

import type { FilterGroup, FilterGroupId } from '@/types/product';

import { styles } from './styles';

type StorefrontFilterChipsProps = {
  groups: FilterGroup[];
  selectedIds: Set<string>;
  onToggle: (groupId: FilterGroupId, optionId: string) => void;
  onOpenSheet: () => void;
};

export function StorefrontFilterChips({
  groups,
  selectedIds,
  onToggle,
  onOpenSheet,
}: StorefrontFilterChipsProps) {
  const estilos = groups.find((group) => group.id === 'estilos');
  const selectedEstilos = estilos?.options.filter((option) => selectedIds.has(option.id)) ?? [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {estilos && (
        <Pressable
          onPress={() => selectedEstilos.forEach((option) => onToggle(estilos.id, option.id))}
          style={({ pressed }) => [
            styles.chip,
            selectedEstilos.length === 0 ? styles.chipSelected : styles.chipDefault,
            pressed && styles.chipPressed,
          ]}
        >
          <Text
            style={[
              styles.label,
              selectedEstilos.length === 0 ? styles.labelSelected : styles.labelDefault,
            ]}
          >
            Todos
          </Text>
        </Pressable>
      )}

      {estilos?.options.map((option) => {
        const isSelected = selectedIds.has(option.id);

        return (
          <Pressable
            key={option.id}
            onPress={() => onToggle(estilos.id, option.id)}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipDefault,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelDefault]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={onOpenSheet}
        style={({ pressed }) => [styles.chip, styles.chipDefault, pressed && styles.chipPressed]}
      >
        <Text style={[styles.label, styles.labelDefault]}>Mais filtros</Text>
      </Pressable>
    </ScrollView>
  );
}

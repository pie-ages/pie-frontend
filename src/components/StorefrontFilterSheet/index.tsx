import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';
import type { FilterGroup, FilterGroupId } from '@/types/Filter';

import { styles } from './styles';

type StorefrontFilterSheetProps = {
  visible: boolean;
  groups: FilterGroup[];
  pendingFiltersByGroup: Record<FilterGroupId, Set<string>>;
  onTogglePending: (groupId: FilterGroupId, optionId: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

export function StorefrontFilterSheet({
  visible,
  groups,
  pendingFiltersByGroup,
  onTogglePending,
  onApply,
  onClear,
  onClose,
}: StorefrontFilterSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.grabber} />

          <View style={styles.toolbar}>
            <Pressable
              onPress={onClose}
              hitSlop={Spacing.two}
              style={[styles.iconButton, styles.closeButton]}
            >
              <Feather name="x" size={16} color={Colors.light.text} />
            </Pressable>

            <Text style={styles.title}>Filtros</Text>

            <Pressable
              onPress={onApply}
              hitSlop={Spacing.two}
              style={[styles.iconButton, styles.applyButton]}
            >
              <Feather name="check" size={16} color={Colors.white} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {groups.map((group) => {
              const selected = pendingFiltersByGroup[group.id];

              return (
                <View key={group.id} style={styles.group}>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <View style={styles.chipsWrap}>
                    {group.options.map((option) => {
                      const isSelected = selected.has(option.id);

                      return (
                        <Pressable
                          key={option.id}
                          onPress={() => onTogglePending(group.id, option.id)}
                          style={({ pressed }) => [
                            styles.chip,
                            isSelected ? styles.chipSelected : styles.chipDefault,
                            pressed && styles.chipPressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipLabel,
                              isSelected ? styles.chipLabelSelected : styles.chipLabelDefault,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <Pressable onPress={onClear} hitSlop={Spacing.two} style={styles.clearButton}>
              <Text style={styles.clearLabel}>Limpar filtros</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

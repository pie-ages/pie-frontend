import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Animated as RNAnimated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new RNAnimated.Value(300));

  const selectedCount = Object.values(pendingFiltersByGroup).reduce(
    (sum, set) => sum + set.size,
    0,
  );
  const hasAnySelected = selectedCount > 0;

  useEffect(() => {
    if (visible) {
      translateY.setValue(300);
      RNAnimated.spring(translateY, {
        toValue: 0,
        damping: 24,
        stiffness: 240,
        mass: 0.8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 70 || gestureState.vy > 0.6) {
            RNAnimated.timing(translateY, {
              toValue: 500,
              duration: 180,
              useNativeDriver: true,
            }).start(() => {
              onClose();
            });
          } else {
            RNAnimated.spring(translateY, {
              toValue: 0,
              damping: 22,
              stiffness: 260,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onClose, translateY],
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar filtros"
        />

        {visible && (
          <RNAnimated.View style={[styles.panel, { transform: [{ translateY }] }]}>
            <View {...panResponder.panHandlers} style={styles.toolbar}>
              <Text style={styles.title}>Filtros</Text>

              <Pressable
                onPress={onClose}
                hitSlop={Spacing.two}
                accessibilityRole="button"
                accessibilityLabel="Fechar filtros"
                style={({ pressed }) => [styles.closeButton, pressed && styles.chipPressed]}
              >
                <Feather name="x" size={20} color={Colors.brand.primary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
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
            </ScrollView>

            <View
              style={[
                styles.footer,
                { paddingBottom: Math.max(insets.bottom + Spacing.two, Spacing.three) },
              ]}
            >
              <Pressable
                onPress={onClear}
                disabled={!hasAnySelected}
                accessibilityRole="button"
                accessibilityLabel="Limpar filtros"
                style={({ pressed }) => [
                  styles.clearButton,
                  !hasAnySelected && styles.clearButtonDisabled,
                  pressed && hasAnySelected && styles.chipPressed,
                ]}
              >
                <Text style={[styles.clearLabel, !hasAnySelected && styles.clearLabelDisabled]}>
                  Limpar
                </Text>
              </Pressable>

              <Pressable
                onPress={onApply}
                accessibilityRole="button"
                accessibilityLabel="Aplicar filtros"
                style={({ pressed }) => [styles.applyButton, pressed && styles.chipPressed]}
              >
                <Text style={styles.applyLabel}>
                  {selectedCount > 0 ? `Aplicar (${selectedCount})` : 'Aplicar'}
                </Text>
              </Pressable>
            </View>
          </RNAnimated.View>
        )}
      </View>
    </Modal>
  );
}

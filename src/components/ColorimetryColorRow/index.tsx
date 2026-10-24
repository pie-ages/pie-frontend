import { Feather } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';

import { COMPACT_SWATCH_SIZE, styles } from './styles';

type ColorimetryColorRowProps = {
  title: string;
  caption?: string;
  colors: (string | null)[];
  emptyColor?: string;
  disabled?: boolean;
  compact?: boolean;
  onSlotPress?: (index: number) => void;
  onSlotRemove?: (index: number) => void;
};

export function ColorimetryColorRow({
  title,
  caption,
  colors,
  emptyColor = '#999999',
  disabled = false,
  compact = false,
  onSlotPress,
  onSlotRemove,
}: ColorimetryColorRowProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>

      <View style={[styles.row, onSlotPress && styles.editableRow, compact && styles.rowCompact]}>
        {colors.map((color, index) => {
          if (color === null && onSlotPress) {
            return (
              <Pressable
                key={`empty-${index}`}
                accessibilityRole="button"
                accessibilityLabel="Adicionar cor favorita"
                accessibilityState={{ disabled }}
                disabled={disabled}
                onPress={() => onSlotPress(index)}
                style={styles.addButton}
              >
                <Feather name="plus" size={24} color={Colors.brand.primary} />
              </Pressable>
            );
          }

          return (
            <View
              key={`${color}-${index}`}
              style={[styles.colorSlot, compact && styles.colorSlotCompact]}
            >
              <ColorSwatch
                color={color ?? emptyColor}
                size={compact ? COMPACT_SWATCH_SIZE : undefined}
                outlined={compact}
                selected={!!onSlotPress && color !== null}
                onPress={onSlotPress && !disabled ? () => onSlotPress(index) : undefined}
              />
              {color !== null && onSlotRemove && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remover cor favorita ${index + 1}`}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={() => onSlotRemove(index)}
                  hitSlop={4}
                  style={styles.removeButton}
                >
                  <Feather name="x" size={14} color="#661414" />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {caption && (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={[styles.caption, compact && styles.captionCompact]}
        >
          {caption}
        </ThemedText>
      )}
    </View>
  );
}

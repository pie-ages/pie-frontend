import { View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

type ColorimetryColorRowProps = {
  title: string;
  caption?: string;
  colors: (string | null)[];
  emptyColor?: string;
  disabled?: boolean;
  compact?: boolean;
  onSlotPress?: (index: number) => void;
};

const COMPACT_SWATCH_SIZE = 40;

export function ColorimetryColorRow({
  title,
  caption,
  colors,
  emptyColor = '#999999',
  disabled = false,
  compact = false,
  onSlotPress,
}: ColorimetryColorRowProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>

      <View style={[styles.row, compact && styles.rowCompact]}>
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color}-${index}`}
            color={color ?? emptyColor}
            size={compact ? COMPACT_SWATCH_SIZE : undefined}
            outlined={compact}
            selected={!!onSlotPress && color !== null}
            onPress={onSlotPress && !disabled ? () => onSlotPress(index) : undefined}
          />
        ))}
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

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
  onSlotPress?: (index: number) => void;
};

export function ColorimetryColorRow({
  title,
  caption,
  colors,
  emptyColor = '#999999',
  disabled = false,
  onSlotPress,
}: ColorimetryColorRowProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.row}>
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color}-${index}`}
            color={color ?? emptyColor}
            selected={!!onSlotPress && color !== null}
            onPress={onSlotPress && !disabled ? () => onSlotPress(index) : undefined}
          />
        ))}
      </View>

      {caption && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
          {caption}
        </ThemedText>
      )}
    </View>
  );
}

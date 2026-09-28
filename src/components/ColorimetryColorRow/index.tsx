import { View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

type ColorimetryColorRowProps = {
  title: string;
  caption?: string;
  colors: string[];
  emptyColor?: string;
  onSlotPress?: (index: number) => void;
};

export function ColorimetryColorRow({
  title,
  caption,
  colors,
  emptyColor,
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
            color={color}
            selected={!!onSlotPress && color !== emptyColor}
            onPress={onSlotPress ? () => onSlotPress(index) : undefined}
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

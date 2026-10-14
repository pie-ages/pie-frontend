import { Feather } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type ColorimetryColorRowAction = {
  label: string;
  icon: string;
  onPress: () => void;
};

type ColorimetryColorRowProps = {
  title: string;
  caption?: string;
  colors: (string | null)[];
  emptyColor?: string;
  disabled?: boolean;
  onSlotPress?: (index: number) => void;
  action?: ColorimetryColorRowAction;
};

export function ColorimetryColorRow({
  title,
  caption,
  colors,
  emptyColor = '#999999',
  disabled = false,
  onSlotPress,
  action,
}: ColorimetryColorRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>

        {action && (
          <Pressable
            onPress={action.onPress}
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Feather name={action.icon as never} size={18} color={Colors.brand.primary} />
          </Pressable>
        )}
      </View>

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

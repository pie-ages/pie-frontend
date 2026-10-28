import { Pressable } from 'react-native';

import { styles } from './styles';

type ColorSwatchProps = {
  color: string;
  size?: number;
  selected?: boolean;
  outlined?: boolean;
  onPress?: () => void;
};

export function ColorSwatch({
  color,
  size,
  selected = false,
  outlined = false,
  onPress,
}: ColorSwatchProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.swatch,
        size !== undefined && { width: size, height: size, borderRadius: size / 2 },
        { backgroundColor: color },
        outlined && styles.outlined,
        selected && styles.selected,
        onPress && pressed && styles.pressed,
      ]}
    />
  );
}

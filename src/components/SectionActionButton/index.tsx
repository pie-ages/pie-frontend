import { Feather } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export type SectionAction = {
  title: string;
  label: string;
  icon: string;
  onPress: () => void;
};

export function SectionActionButton({ title, label, icon, onPress }: SectionAction) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Feather name={icon as never} size={14} color={Colors.brand.primary} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

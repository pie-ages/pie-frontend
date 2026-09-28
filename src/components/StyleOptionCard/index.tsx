import { Pressable, Text } from 'react-native';

import { styles } from './styles';

type StyleOptionCardProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export function StyleOptionCard({ label, isSelected, onPress }: StyleOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.cardSelected : styles.cardDefault,
        pressed && styles.cardPressed,
      ]}
    >
      <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

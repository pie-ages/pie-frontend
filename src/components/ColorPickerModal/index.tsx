import { Modal, Pressable, View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

type ColorPickerModalProps = {
  visible: boolean;
  colors: string[];
  selectedColor?: string;
  onSelect: (color: string) => void;
  onClose: () => void;
};

export function ColorPickerModal({
  visible,
  colors,
  selectedColor,
  onSelect,
  onClose,
}: ColorPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <ThemedText type="smallBold" style={styles.title}>
            Escolha uma cor favorita
          </ThemedText>

          <View style={styles.grid}>
            {colors.map((color, index) => (
              <ColorSwatch
                key={`${color}-${index}`}
                color={color}
                selected={color === selectedColor}
                onPress={() => onSelect(color)}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

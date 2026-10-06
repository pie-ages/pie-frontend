import { useRef, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  type ColorFormatsObject,
} from 'reanimated-color-picker';

import { AuthButton } from '@/components/AuthButton';
import { ThemedText } from '@/components/ThemedText';
import { hexToRgb, rgbToHex } from '@/utils/rgb-color';

import { styles } from './styles';

type ColorPickerModalProps = {
  visible: boolean;
  selectedColor?: string;
  onSelect: (color: string) => void;
  onRemove?: () => void;
  onClose: () => void;
};

export function ColorPickerModal({
  visible,
  selectedColor,
  onSelect,
  onRemove,
  onClose,
}: ColorPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar seletor de cores"
          style={styles.dismissArea}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          {visible && (
            <VisualColorForm
              selectedColor={selectedColor}
              onSelect={onSelect}
              onRemove={onRemove}
              onClose={onClose}
            />
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

type VisualColorFormProps = Omit<ColorPickerModalProps, 'visible'>;

function VisualColorForm({ selectedColor, onSelect, onRemove, onClose }: VisualColorFormProps) {
  const initialRgb = selectedColor ? hexToRgb(selectedColor) : null;
  const initialColor = initialRgb ? rgbToHex(initialRgb) : '#FF0000';

  const currentColor = useRef(initialColor);
  const [error, setError] = useState<string | null>(null);

  function handleColorChange(color: ColorFormatsObject) {
    currentColor.current = color.hex.toUpperCase();
  }

  function handleConfirm() {
    const rgb = hexToRgb(currentColor.current);

    if (rgb === null) {
      setError('Não foi possível selecionar essa cor. Tente novamente.');
      return;
    }

    setError(null);
    onSelect(rgbToHex(rgb));
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="smallBold">
          {selectedColor ? 'Editar cor favorita' : 'Adicionar cor favorita'}
        </ThemedText>

        <ThemedText type="small">
          Arraste na paleta para escolher a cor. Use a barra colorida para mudar a tonalidade.
        </ThemedText>

        <ColorPicker
          value={initialColor}
          onChangeJS={handleColorChange}
          onCompleteJS={handleColorChange}
          style={styles.picker}
        >
          <Panel1 style={styles.panel} />

          <HueSlider style={styles.hueSlider} />

          <Preview style={styles.preview} />
        </ColorPicker>

        {error && (
          <ThemedText accessibilityRole="alert" style={styles.error}>
            {error}
          </ThemedText>
        )}

        <AuthButton
          title={selectedColor ? 'Aplicar cor' : 'Adicionar cor'}
          onPress={handleConfirm}
        />

        {onRemove && <AuthButton title="Remover cor" variant="secondary" onPress={onRemove} />}

        <AuthButton title="Cancelar" variant="secondary" onPress={onClose} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { Modal, Pressable, Text, View } from 'react-native';

import { AuthButton } from '@/components/AuthButton';
import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

type ColorimetryConsentModalProps = {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
  onDismiss?: () => void;
};

export function ColorimetryConsentModal({
  visible,
  onAccept,
  onClose,
  onDismiss,
}: ColorimetryConsentModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}} accessibilityViewIsModal>
          <ThemedText type="smallBold">Antes da foto</ThemedText>

          <ThemedText themeColor="textSecondary">
            Sua foto é enviada para uma IA (AWS) só para identificar as cores que combinam com você.
            Ela não é salva: guardamos apenas o resultado da colorimetria.
          </ThemedText>

          <View style={styles.actions}>
            <AuthButton
              title="Concordo e tirar foto"
              onPress={onAccept}
              accessibilityRole="button"
              accessibilityLabel="Concordar com o uso da foto e abrir a câmera"
            />
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
              <Text style={styles.dismiss}>Agora não</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

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
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        {visible && (
          <Animated.View
            entering={FadeInDown.duration(260).reduceMotion(ReduceMotion.System)}
            style={styles.sheet}
            accessibilityViewIsModal
          >
            <ThemedText type="smallBold">Antes da foto</ThemedText>

            <ThemedText themeColor="textSecondary">
              Sua foto é enviada para uma IA (AWS) só para identificar as cores que combinam com
              você. Ela não é salva: guardamos apenas o resultado da colorimetria.
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
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

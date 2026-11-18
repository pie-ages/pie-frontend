import { Feather } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { ReduceMotion, ZoomIn } from 'react-native-reanimated';

import { AuthButton } from '@/components/AuthButton';
import { Colors, Spacing } from '@/constants/Theme';

type SuccessModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  buttonTitle: string;
  onContinue: () => void;
};

export function SuccessModal({
  visible,
  title,
  message,
  buttonTitle,
  onContinue,
}: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <View style={styles.backdrop}>
        {visible && (
          <Animated.View
            entering={ZoomIn.duration(240).reduceMotion(ReduceMotion.System)}
            style={styles.card}
            accessibilityViewIsModal
          >
            <View style={styles.circle}>
              <Feather name="check" size={32} color={Colors.white} />
            </View>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            {message && <Text style={styles.message}>{message}</Text>}
            <AuthButton title={buttonTitle} onPress={onContinue} />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: 24,
    backgroundColor: Colors.white,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    paddingBottom: Spacing.one,
  },
});

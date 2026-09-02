import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type VitrineErrorStateProps = {
  onRetry: () => void;
};

export function VitrineErrorState({ onRetry }: VitrineErrorStateProps) {
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={32} color="#B3261E" />
      <Text style={styles.title}>Não foi possível carregar a vitrine</Text>
      <Text style={styles.subtitle}>Verifique sua conexão e tente novamente.</Text>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6E263D',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

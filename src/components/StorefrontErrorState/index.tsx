import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type StorefrontErrorStateProps = {
  onRetry: () => void;
};

export function StorefrontErrorState({ onRetry }: StorefrontErrorStateProps) {
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={32} color={Colors.error} />
      <Text style={styles.title}>Não foi possível carregar a storefront</Text>
      <Text style={styles.subtitle}>Verifique sua conexão e tente novamente.</Text>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

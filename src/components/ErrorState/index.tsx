import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type ErrorStateProps = {
  title: string;
  subtitle?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title,
  subtitle,
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={32} color={Colors.error} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

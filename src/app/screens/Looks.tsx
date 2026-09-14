import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/Theme';

export default function LooksScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Ionicons name="sparkles-outline" size={48} color={Colors.icon} />
      <Text style={styles.title}>Looks</Text>
      <Text style={styles.description}>
        Em breve você vai poder montar e salvar seus looks aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.light.text,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});

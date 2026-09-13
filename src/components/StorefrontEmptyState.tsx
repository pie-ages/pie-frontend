import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

export function StorefrontEmptyState() {
  return (
    <View style={styles.container}>
      <Feather name="shopping-bag" size={32} color={Colors.iconMuted} />
      <Text style={styles.title}>Nenhum produto encontrado</Text>
      <Text style={styles.subtitle}>Tente ajustar os filtros ou volte mais tarde.</Text>
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
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

export function StorefrontLoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brand.accent} />
      <Text style={styles.text}>Carregando produtos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 64,
  },
  text: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});

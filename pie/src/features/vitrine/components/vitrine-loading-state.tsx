import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function VitrineLoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6E263D" />
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
    color: '#60646C',
  },
});

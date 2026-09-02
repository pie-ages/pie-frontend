import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function VitrineHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <View style={styles.iconButton}>
          <Feather name="clipboard" size={18} color="#1F1F1F" />
        </View>

        <View style={[styles.iconButton, styles.profileButton]}>
          <Feather name="user" size={18} color="#6E263D" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F3',
  },
  profileButton: {
    backgroundColor: '#F3EBEE',
  },
});

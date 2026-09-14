import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/Theme';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MaterialCommunityIcons name="wardrobe-outline" size={48} color={Colors.icon} />
      <Text style={styles.title}>Closet</Text>
      <Text style={styles.description}>Em breve você vai poder organizar suas roupas aqui.</Text>
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
    backgroundColor: Colors.white,
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

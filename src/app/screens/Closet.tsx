import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenToolBar } from '@/components/ScreenToolBar';
import { Colors, Spacing } from '@/constants/Theme';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ScreenToolBar title="Closet" />
      </View>
      <View style={styles.container}>
        <MaterialCommunityIcons name="wardrobe-outline" size={48} color={Colors.icon} />
        <Text style={styles.description}>Em breve você vai poder organizar suas roupas aqui.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});

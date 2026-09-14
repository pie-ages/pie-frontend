import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

export function StorefrontToolBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/screens/Wishlist')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={18}
            color={Colors.light.text}
          />
        </Pressable>

        <View style={[styles.iconButton, styles.profileButton]}>
          <Feather name="user" size={18} color={Colors.light.text} />
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
    color: Colors.light.text,
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
    backgroundColor: Colors.light.backgroundElement,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  profileButton: {
    backgroundColor: Colors.brand.tertiary,
  },
});

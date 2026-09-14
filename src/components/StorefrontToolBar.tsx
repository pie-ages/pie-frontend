import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';

export function StorefrontToolBar() {
  const { signOut } = useAuth();

  function handleLogout() {
    signOut();
    router.replace('/screens/Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <View style={styles.iconButton}>
          <Feather name="shopping-bag" size={18} color={Colors.light.text} />
        </View>

        <Pressable
          style={[styles.iconButton, styles.profileButton]}
          onPress={handleLogout}
          accessibilityLabel="Sair"
        >
          <Feather name="user" size={18} color={Colors.light.text} />
        </Pressable>
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
  profileButton: {
    backgroundColor: Colors.brand.tertiary,
  },
});

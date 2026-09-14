import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

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

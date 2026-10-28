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
          onPress={() => router.push('/Wishlist')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <MaterialCommunityIcons name="heart" size={18} color={Colors.light.text} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/Profile')}
          style={({ pressed }) => [
            styles.iconButton,
            styles.profileButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <Feather name="user" size={18} color={Colors.light.text} />
        </Pressable>
      </View>
    </View>
  );
}

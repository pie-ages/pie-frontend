import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export function LooksToolBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Looks</Text>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Criar look"
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Feather name="plus" size={22} color={Colors.light.text} />
        </Pressable>

        <View style={[styles.iconButton, styles.profileButton]}>
          <Feather name="user" size={20} color={Colors.light.text} />
        </View>
      </View>
    </View>
  );
}

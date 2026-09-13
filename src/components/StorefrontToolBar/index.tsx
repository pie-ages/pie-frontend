import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export function StorefrontToolBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <View style={styles.iconButton}>
          <Feather name="clipboard" size={18} color={Colors.light.text} />
        </View>

        <View style={[styles.iconButton, styles.profileButton]}>
          <Feather name="user" size={18} color={Colors.light.text} />
        </View>
      </View>
    </View>
  );
}

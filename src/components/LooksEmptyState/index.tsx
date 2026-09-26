import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export function LooksEmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="sparkles-outline" size={32} color={Colors.icon} />
      <Text style={styles.title}>Você ainda não tem looks</Text>
      <Text style={styles.subtitle}>Monte seu primeiro look para vê-lo aqui.</Text>
    </View>
  );
}

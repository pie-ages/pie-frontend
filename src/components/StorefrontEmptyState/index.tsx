import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export function StorefrontEmptyState() {
  return (
    <View style={styles.container}>
      <Feather name="shopping-bag" size={32} color={Colors.iconMuted} />
      <Text style={styles.title}>Nenhum produto encontrado</Text>
      <Text style={styles.subtitle}>Tente ajustar os filtros ou volte mais tarde.</Text>
    </View>
  );
}

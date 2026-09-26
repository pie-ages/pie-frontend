import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export function LooksLoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brand.accent} />
      <Text style={styles.text}>Carregando looks...</Text>
    </View>
  );
}

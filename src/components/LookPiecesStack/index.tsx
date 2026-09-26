import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/look';

import { styles } from './styles';

type LookPiecesStackProps = {
  look: Look;
};

// Mostra apenas as peças do look, empilhadas no tamanho original.
export function LookPiecesStack({ look }: LookPiecesStackProps) {
  if (look.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="layers" size={24} color={Colors.light.textSecondary} />
        <Text style={styles.emptyText}>Este look ainda não tem peças</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel={look.name}>
      {look.items.map((item) => (
        <View key={item.id} style={styles.piece}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.pieceImage}
              contentFit="contain"
              accessibilityLabel={item.name}
            />
          ) : (
            <Feather name="image" size={28} color={Colors.iconMuted} />
          )}
        </View>
      ))}
    </View>
  );
}

import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { LookImage } from '@/components/LookImage';
import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/Look';

import { LOOK_PIECE_RADIUS, styles } from './styles';

type LookPiecesStackProps = {
  look: Look;
};

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
      {look.items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === look.items.length - 1;

        return (
          <View
            key={item.id}
            style={[
              styles.piece,
              {
                borderTopLeftRadius: isFirst ? LOOK_PIECE_RADIUS : 0,
                borderTopRightRadius: isFirst ? LOOK_PIECE_RADIUS : 0,
                borderBottomLeftRadius: isLast ? LOOK_PIECE_RADIUS : 0,
                borderBottomRightRadius: isLast ? LOOK_PIECE_RADIUS : 0,
              },
            ]}
          >
            <LookImage
              uri={item.imageUrl}
              style={styles.pieceImage}
              accessibilityLabel={item.name ?? 'Peça sem nome'}
            />
          </View>
        );
      })}
    </View>
  );
}

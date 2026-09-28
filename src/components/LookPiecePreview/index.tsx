import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import type { LookPiece } from '@/types/Look';

export function LookPiecePreview({ piece }: { piece: LookPiece }) {
  const icon = piece.category === 'Calçados' ? 'shoe-sneaker' : 'hanger';
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={56} color={piece.color} />
      <Text style={styles.name}>{piece.name}</Text>
      <Text style={styles.category}>{piece.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6, padding: 12 },
  name: { color: Colors.light.text, textAlign: 'center', fontWeight: '600' },
  category: { color: Colors.light.textSecondary, fontSize: 12 },
});

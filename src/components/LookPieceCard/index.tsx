import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import type { WardrobePiece } from '@/types/look';

import { styles } from './styles';

type LookPieceCardProps = {
  piece: WardrobePiece;
  onPress?: () => void;
  selected?: boolean;
  onRemove?: () => void;
};

export function LookPieceCard({ piece, onPress, selected = false, onRemove }: LookPieceCardProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={piece.name}
        accessibilityState={onPress ? { selected } : undefined}
        style={({ pressed }) => [
          styles.card,
          selected && styles.cardSelected,
          pressed && onPress && styles.cardPressed,
        ]}
      >
        <View style={styles.imageContainer}>
          {piece.imageUrl ? (
            <Image source={{ uri: piece.imageUrl }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.imageFallback}>
              <Feather name="image" size={22} color={Colors.iconMuted} />
            </View>
          )}
          {selected ? (
            <View style={styles.check}>
              <Feather name="check" size={14} color={Colors.white} />
            </View>
          ) : null}
        </View>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {piece.name}
        </Text>
      </Pressable>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${piece.name}`}
          hitSlop={6}
          style={({ pressed }) => [styles.remove, pressed && styles.removePressed]}
        >
          <Feather name="x" size={14} color={Colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

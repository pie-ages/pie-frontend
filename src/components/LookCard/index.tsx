import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/look';

import { styles } from './styles';

type LookCardProps = {
  look: Look;
  onPress: (id: string) => void;
};

export function LookCard({ look, onPress }: LookCardProps) {
  const [showPhoto, setShowPhoto] = useState(false);
  const hasPhoto = Boolean(look.imageUrl);
  const pieceCount = look.items.length;
  const pieceLabel = `${pieceCount} ${pieceCount === 1 ? 'peça' : 'peças'}`;

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        <Pressable
          onPress={() => onPress(look.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${look.name}`}
          style={({ pressed }) => [styles.mediaTap, pressed && styles.pressed]}
        >
          {showPhoto && look.imageUrl ? (
            <Image source={{ uri: look.imageUrl }} style={styles.photo} contentFit="cover" />
          ) : (
            <View style={styles.collage}>
              {look.items.slice(0, 4).map((item) => (
                <View key={item.id} style={styles.collageCell}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.collageImage}
                      contentFit="cover"
                      accessibilityLabel={item.name ?? 'Peça sem nome'}
                    />
                  ) : (
                    <Feather name="image" size={20} color={Colors.iconMuted} />
                  )}
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.info}>
        <Pressable
          onPress={() => onPress(look.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${look.name}`}
          style={styles.infoText}
        >
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {look.name}
          </Text>
          <Text style={styles.count}>{pieceLabel}</Text>
        </Pressable>

        {hasPhoto ? (
          <Pressable
            onPress={() => setShowPhoto((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={showPhoto ? 'Ver as peças do look' : 'Ver foto usando o look'}
            hitSlop={6}
            style={({ pressed }) => [styles.photoButton, pressed && styles.photoButtonPressed]}
          >
            <Feather name={showPhoto ? 'grid' : 'camera'} size={16} color={Colors.light.text} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

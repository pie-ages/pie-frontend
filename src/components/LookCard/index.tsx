import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { LookImage } from '@/components/LookImage';
import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/Look';

import { styles } from './styles';

type LookCardProps = {
  look: Look;
  onPress: (id: string) => void;
};

export function LookCard({ look, onPress }: LookCardProps) {
  const [showPhoto, setShowPhoto] = useState(false);
  const [rotation] = useState(() => new Animated.Value(0));
  const hasPhoto = Boolean(look.imageUrl);
  const pieceCount = look.items.length;
  const pieceLabel = `${pieceCount} ${pieceCount === 1 ? 'peça' : 'peças'}`;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: showPhoto ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [showPhoto, rotation]);

  const frontRotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        <Pressable
          onPress={() => onPress(look.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${look.name}`}
          style={({ pressed }) => [styles.mediaTap, pressed && styles.pressed]}
        >
          <Animated.View
            style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotateY }] }]}
          >
            <View style={styles.collage}>
              {look.items.length === 0 && <LookImage uri={null} style={styles.collageImage} />}
              {look.items.slice(0, 4).map((item) => (
                <View key={item.id} style={styles.collageCell}>
                  <LookImage
                    uri={item.imageUrl}
                    style={styles.collageImage}
                    accessibilityLabel={item.name ?? 'Peça sem nome'}
                  />
                </View>
              ))}
            </View>
          </Animated.View>

          {hasPhoto ? (
            <Animated.View
              style={[
                styles.face,
                { transform: [{ perspective: 1000 }, { rotateY: backRotateY }] },
              ]}
            >
              <LookImage uri={look.imageUrl} style={styles.photo} accessibilityLabel={look.name} />
            </Animated.View>
          ) : null}
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

import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  const rotation = useSharedValue(0);
  const hasPhoto = Boolean(look.imageUrl);
  const pieceCount = look.items.length;
  const pieceLabel = `${pieceCount} ${pieceCount === 1 ? 'peça' : 'peças'}`;

  useEffect(() => {
    rotation.value = withTiming(showPhoto ? 1 : 0, {
      duration: 380,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [showPhoto, rotation]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value * 180}deg` }],
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${180 + rotation.value * 180}deg` }],
  }));

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        <Pressable
          onPress={() => onPress(look.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${look.name}`}
          style={({ pressed }) => [styles.mediaTap, pressed && styles.pressed]}
        >
          <Animated.View style={[styles.face, frontAnimatedStyle]}>
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
            <Animated.View style={[styles.face, backAnimatedStyle]}>
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

import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { LookPiecesStack } from '@/components/LookPiecesStack';
import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/look';

import { styles } from './styles';

type LookFlipCardProps = {
  look: Look;
  interactive: boolean;
  onSelect: () => void;
  onAddPhoto?: (lookId: string) => void;
};

export function LookFlipCard({ look, interactive, onSelect, onAddPhoto }: LookFlipCardProps) {
  const hasPhoto = Boolean(look.imageUrl);
  const [flipped, setFlipped] = useState(false);
  const [wasInteractive, setWasInteractive] = useState(interactive);
  const [rotation] = useState(() => new Animated.Value(0));

  if (wasInteractive !== interactive) {
    setWasInteractive(interactive);
    if (!interactive) setFlipped(false);
  }

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: flipped ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [flipped, rotation]);

  const frontRotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  function handleFrontPress() {
    if (!interactive) {
      onSelect();
      return;
    }
    setFlipped(true);
  }

  const frontLabel = !interactive
    ? `Ver ${look.name}`
    : hasPhoto
      ? `${look.name}: ver foto usando o look`
      : `${look.name}: adicionar foto usando o look`;

  return (
    <View>
      <Animated.View
        pointerEvents={flipped ? 'none' : 'auto'}
        style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotateY }] }]}
      >
        <Pressable
          onPress={handleFrontPress}
          accessibilityRole="button"
          accessibilityLabel={frontLabel}
        >
          <LookPiecesStack look={look} />
        </Pressable>
        {interactive ? (
          <View style={styles.badge} pointerEvents="none">
            <Feather name="camera" size={14} color={Colors.white} />
          </View>
        ) : null}
      </Animated.View>

      <Animated.View
        pointerEvents={flipped ? 'auto' : 'none'}
        style={[
          styles.face,
          styles.back,
          { transform: [{ perspective: 1000 }, { rotateY: backRotateY }] },
        ]}
      >
        {hasPhoto ? (
          <Pressable
            onPress={() => setFlipped(false)}
            accessibilityRole="button"
            accessibilityLabel={`${look.name}: voltar para as peças`}
            style={styles.backFill}
          >
            <Image source={{ uri: look.imageUrl! }} style={styles.backImage} contentFit="cover" />
          </Pressable>
        ) : (
          <View style={styles.addPhoto}>
            <Feather name="camera" size={28} color={Colors.light.textSecondary} />
            <Text style={styles.addPhotoText}>Você ainda não tem uma foto usando este look</Text>
            <Pressable
              onPress={() => onAddPhoto?.(look.id)}
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto usando o look"
              style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            >
              <Feather name="plus" size={16} color={Colors.white} />
              <Text style={styles.addButtonText}>Adicionar foto</Text>
            </Pressable>
          </View>
        )}
        <Pressable
          onPress={() => setFlipped(false)}
          accessibilityRole="button"
          accessibilityLabel="Voltar para as peças"
          style={styles.badge}
        >
          <Feather name="layers" size={14} color={Colors.white} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

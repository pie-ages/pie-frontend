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
import { LookPiecesStack } from '@/components/LookPiecesStack';
import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/Look';

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
  const rotation = useSharedValue(0);

  if (wasInteractive !== interactive) {
    setWasInteractive(interactive);
    if (!interactive) setFlipped(false);
  }

  useEffect(() => {
    rotation.value = withTiming(flipped ? 1 : 0, {
      duration: 380,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [flipped, rotation]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value * 180}deg` }],
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${180 + rotation.value * 180}deg` }],
  }));

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
        style={[styles.face, frontAnimatedStyle]}
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
        style={[styles.face, styles.back, backAnimatedStyle]}
      >
        {hasPhoto ? (
          <Pressable
            onPress={() => setFlipped(false)}
            accessibilityRole="button"
            accessibilityLabel={`${look.name}: voltar para as peças`}
            style={styles.backFill}
          >
            <LookImage
              uri={look.imageUrl}
              style={styles.backImage}
              accessibilityLabel={look.name}
            />
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

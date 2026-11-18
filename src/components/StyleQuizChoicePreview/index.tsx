import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, ZoomIn } from 'react-native-reanimated';

import { useLayoutScale } from '@/hooks/UseLayoutScale';
import type { StyleQuizOption } from '@/schemas/styleSchema';
import type { StyleQuizAnswer } from '@/types/StyleQuiz';

import { createStyles } from './styles';

type StyleQuizChoicePreviewProps = {
  answer?: StyleQuizAnswer;
  options: StyleQuizOption[];
  onBack: () => void;
  onConfirm: () => void;
};

const TITLES = {
  both: 'Usaria os dois!',
  none: 'Nenhum dos dois',
} as const;

export function StyleQuizChoicePreview({
  answer,
  options,
  onBack,
  onConfirm,
}: StyleQuizChoicePreviewProps) {
  const { s } = useLayoutScale();
  const styles = useMemo(() => createStyles(s), [s]);
  const [shown, setShown] = useState({ answer, options });

  if (answer && answer !== shown.answer) {
    setShown({ answer, options });
  }

  const shownAnswer = shown.answer;
  const selectedOption =
    shownAnswer?.type === 'option'
      ? shown.options.find((option) => option.id === shownAnswer.optionId)
      : undefined;

  return (
    <Modal
      visible={Boolean(answer)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onBack}
    >
      <BlurView
        intensity={45}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.dim, Platform.OS === 'android' && styles.dimAndroid]} />

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar e escolher novamente"
      />

      {shownAnswer ? (
        <Animated.View
          entering={ZoomIn.duration(220).reduceMotion(ReduceMotion.System)}
          style={styles.content}
          pointerEvents="box-none"
        >
          {selectedOption ? (
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    typeof selectedOption.imageUrl === 'string'
                      ? { uri: selectedOption.imageUrl }
                      : selectedOption.imageUrl
                  }
                  style={styles.image}
                  contentFit="cover"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.label} allowFontScaling={false}>
                  {selectedOption.label}
                </Text>
              </View>
            </View>
          ) : null}

          {shownAnswer.type !== 'option' ? (
            <View style={styles.multiSelectionCard}>
              <Text style={styles.title} allowFontScaling={false}>
                {TITLES[shownAnswer.type]}
              </Text>

              <View style={[styles.row, shownAnswer.type === 'none' && styles.dimmed]}>
                {shown.options.map((option) => (
                  <View key={option.id} style={styles.smallCard}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={
                          typeof option.imageUrl === 'string'
                            ? { uri: option.imageUrl }
                            : option.imageUrl
                        }
                        style={styles.image}
                        contentFit="cover"
                      />
                    </View>
                    <Text style={styles.smallLabel} numberOfLines={2} allowFontScaling={false}>
                      {option.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Animated.View
            entering={FadeIn.delay(60).duration(180).reduceMotion(ReduceMotion.System)}
            style={styles.actions}
          >
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              style={({ pressed }) => [styles.button, styles.backButton, pressed && styles.pressed]}
            >
              <Text style={[styles.buttonText, styles.backText]} allowFontScaling={false}>
                Voltar
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.buttonText, styles.confirmText]} allowFontScaling={false}>
                Confirmar
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      ) : null}
    </Modal>
  );
}

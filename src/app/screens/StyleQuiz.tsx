import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyleQuizChoicePreview } from '@/components/StyleQuizChoicePreview';
import { StyleQuizFooter } from '@/components/StyleQuizFooter';
import { StyleQuizOptionCard } from '@/components/StyleQuizOptionCard';
import { Colors, Spacing, SystemFonts } from '@/constants/Theme';
import { MAX_CONTENT_WIDTH, type ScaleFn, useLayoutScale } from '@/hooks/UseLayoutScale';
import { useStyleQuiz } from '@/hooks/UseStyleQuiz';
import type { StyleQuizAnswer } from '@/types/StyleQuiz';

const TITLE_TOP = 92;
const MIN_TITLE_GAP = 8;

export default function StyleQuizScreen() {
  const insets = useSafeAreaInsets();
  const { s } = useLayoutScale();
  const scaledStyles = useMemo(() => createScaledStyles(s), [s]);
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });
  const { questions, isLoading, error } = useStyleQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StyleQuizAnswer>>({});
  const [pendingAnswer, setPendingAnswer] = useState<StyleQuizAnswer | null>(null);

  const closePreview = useCallback(() => setPendingAnswer(null), []);

  if (isLoading || !fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.light.text} />
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (error || !currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error ?? 'Não foi possível carregar o questionário.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const titleTop = Math.max(s(TITLE_TOP), insets.top + MIN_TITLE_GAP);

  const visibleAnswer = pendingAnswer ?? currentAnswer;

  function handleConfirmPreview() {
    if (!pendingAnswer) return;

    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: pendingAnswer }));
    setPendingAnswer(null);

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[scaledStyles.content, { paddingTop: titleTop }]}
          contentInsetAdjustmentBehavior="never"
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={scaledStyles.title} accessibilityRole="header" allowFontScaling={false}>
            {'Agora...\nVamos descobrir\nmais sobre seu estilo'}
          </Text>

          <Text style={scaledStyles.question} allowFontScaling={false}>
            {currentQuestion.question}
          </Text>

          <View style={scaledStyles.grid} accessibilityRole="radiogroup">
            {currentQuestion.options.map((option, index) => (
              <StyleQuizOptionCard
                key={option.id}
                option={option}
                index={index}
                isSelected={
                  visibleAnswer?.type === 'option' && visibleAnswer.optionId === option.id
                }
                onSelect={() => setPendingAnswer({ type: 'option', optionId: option.id })}
              />
            ))}
          </View>
        </ScrollView>

        <StyleQuizFooter answer={visibleAnswer} onAnswer={setPendingAnswer} />
      </View>

      <StyleQuizChoicePreview
        answer={pendingAnswer ?? undefined}
        options={currentQuestion.options}
        onBack={closePreview}
        onConfirm={handleConfirmPreview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
});

function createScaledStyles(s: ScaleFn) {
  return StyleSheet.create({
    content: {
      paddingBottom: s(24),
    },
    title: {
      ...SystemFonts.bold,
      paddingHorizontal: s(16),
      fontSize: s(36),
      lineHeight: s(36),
      letterSpacing: s(Platform.OS === 'ios' ? -0.43 : -2),
      color: Colors.light.text,
    },
    question: {
      ...SystemFonts.bold,
      marginTop: s(66),
      paddingHorizontal: s(16),
      fontSize: s(22),
      lineHeight: s(28),
      letterSpacing: s(Platform.OS === 'ios' ? -0.26 : -0.8),
      color: Colors.light.text,
      textAlign: 'center',
    },
    grid: {
      flexDirection: 'row',
      gap: s(10),
      width: s(315),
      marginTop: s(24),
      alignSelf: 'center',
    },
  });
}

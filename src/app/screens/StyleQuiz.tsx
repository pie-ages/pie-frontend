import { router } from 'expo-router';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { submitStyleQuizAndIdentify, StyleSessionError } from '@/api/style';
import { ProductActionButton } from '@/components/ProductActionButton';
import { StyleQuizChoicePreview } from '@/components/StyleQuizChoicePreview';
import { StyleQuizFooter } from '@/components/StyleQuizFooter';
import { StyleQuizOptionCard } from '@/components/StyleQuizOptionCard';
import { Colors, Spacing, SystemFonts } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStyle } from '@/contexts/UserStyleContext';
import { MAX_CONTENT_WIDTH, type ScaleFn, useLayoutScale } from '@/hooks/UseLayoutScale';
import { useStyleQuiz } from '@/hooks/UseStyleQuiz';
import {
  createStyleIdentificationRunner,
  INITIAL_STYLE_IDENTIFICATION_STATE,
  styleIdentificationReducer,
} from '@/types/StyleIdentification';
import type { StyleQuizAnswer } from '@/types/StyleQuiz';
import { getStyleQuizSubmissions } from '@/utils/style-quiz-answers';

const TITLE_TOP = 92;
const MIN_TITLE_GAP = 8;

export default function StyleQuizScreen() {
  const insets = useSafeAreaInsets();
  const { s } = useLayoutScale();
  const scaledStyles = useMemo(() => createScaledStyles(s), [s]);
  const { questions, isLoading, error: quizError } = useStyleQuiz();
  const { setIdentifiedStyle } = useUserStyle();
  const { completeStyleQuiz, signOut } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StyleQuizAnswer>>({});
  const [pendingAnswer, setPendingAnswer] = useState<StyleQuizAnswer | null>(null);
  const [identification, dispatchIdentification] = useReducer(
    styleIdentificationReducer,
    INITIAL_STYLE_IDENTIFICATION_STATE,
  );
  const identificationRunner = useMemo(
    () => createStyleIdentificationRunner(submitStyleQuizAndIdentify),
    [],
  );

  const closePreview = useCallback(() => setPendingAnswer(null), []);

  async function runIdentification(selectedAnswers: Record<string, StyleQuizAnswer> = answers) {
    try {
      const run = identificationRunner(getStyleQuizSubmissions(questions, selectedAnswers));
      if (!run.started) return;
      dispatchIdentification({ type: 'start' });
      const identifiedStyle = await run.promise;
      setIdentifiedStyle(identifiedStyle);
      completeStyleQuiz();
      dispatchIdentification({ type: 'success' });
      router.replace('/screens/MyStyle');
    } catch (requestError) {
      if (requestError instanceof StyleSessionError) {
        await signOut();
        router.replace('/screens/Login');
        return;
      }
      dispatchIdentification({
        type: 'error',
        error:
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível identificar seu estilo. Tente novamente.',
      });
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.light.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (identification.status === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.brand.primary} />
          <Text style={styles.statusText}>Identificando seu estilo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (identification.status === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{identification.error}</Text>
          <ProductActionButton
            title="Tentar novamente"
            style={styles.retryButton}
            onPress={() => void runIdentification()}
          />
          <ProductActionButton
            title="Alterar respostas"
            style={styles.retryButton}
            onPress={() => {
              setCurrentIndex(0);
              dispatchIdentification({ type: 'success' });
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (quizError || !currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {quizError ?? 'Não foi possível carregar o questionário.'}
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

    const updatedAnswers = { ...answers, [currentQuestion.id]: pendingAnswer };
    setAnswers(updatedAnswers);
    setPendingAnswer(null);

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    void runIdentification(updatedAnswers);
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
  statusText: {
    marginTop: Spacing.three,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.four,
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

import { useEffect, useState } from 'react';

import { MOCK_STYLE_QUIZ } from '@/mocks/styleQuiz';
import type { StyleQuizQuestion } from '@/types/StyleQuiz';

const ERROR_MESSAGE = 'Não foi possível carregar o questionário.';

export function useStyleQuiz() {
  const [questions, setQuestions] = useState<StyleQuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadQuestions() {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!isActive) return;

        const sorted = [...MOCK_STYLE_QUIZ.questions].sort((a, b) => a.order - b.order);

        if (sorted.length === 0) {
          setError(ERROR_MESSAGE);
          return;
        }

        setQuestions(sorted);
      } catch {
        if (isActive) {
          setError(ERROR_MESSAGE);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isActive = false;
    };
  }, []);

  return { questions, isLoading, error };
}

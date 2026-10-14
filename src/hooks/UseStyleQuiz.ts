import { useEffect, useState } from 'react';

import type { StyleQuizQuestion } from '@/schemas/styleSchema';
import { fetchStyleQuestions } from '@/services/style';

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
        const sorted = await fetchStyleQuestions();

        if (!isActive) return;

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

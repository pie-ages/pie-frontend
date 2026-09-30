import axios from 'axios';
import { useEffect, useState } from 'react';

import type { StyleQuizQuestion, StyleQuizResponse } from '@/types/StyleQuiz';

const ERROR_MESSAGE = 'Não foi possível carregar o questionário.';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

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
        const response = await axios.get<StyleQuizResponse>(`${API_URL}/api/style/questions`);

        if (!isActive) return;

        const sorted = [...response.data.questions].sort((a, b) => a.order - b.order);

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

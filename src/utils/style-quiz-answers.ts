import type { StyleQuizQuestion } from '@/schemas/styleSchema';
import type { StyleQuizAnswer, StyleQuizSubmission } from '@/types/StyleQuiz';

export function getStyleQuizSubmissions(
  questions: StyleQuizQuestion[],
  answers: Record<string, StyleQuizAnswer>,
): StyleQuizSubmission[] {
  return questions.map((question) => {
    const answer = answers[question.id];
    if (answer?.type === 'both') {
      return { questionId: question.id, optionId: null, answerType: 'BOTH' };
    }
    if (answer?.type === 'none') {
      return { questionId: question.id, optionId: null, answerType: 'NONE' };
    }
    if (answer?.type === 'option') {
      if (!question.options.some((option) => option.id === answer.optionId)) {
        throw new Error('Escolha inválida para a pergunta. Tente novamente.');
      }
      return { questionId: question.id, optionId: answer.optionId, answerType: 'OPTION' };
    }
    throw new Error('Responda a todas as perguntas para identificar seu estilo.');
  });
}

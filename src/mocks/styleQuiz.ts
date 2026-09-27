import { Asset } from 'expo-asset';

import type { StyleQuizResponse } from '@/types/StyleQuiz';

function localImage(module: number) {
  return Asset.fromModule(module).uri;
}

export const MOCK_STYLE_QUIZ: StyleQuizResponse = {
  questions: [
    {
      id: 'q1',
      question: 'Qual look você usaria?',
      order: 1,
      options: [
        {
          id: 'q1-option1',
          label: 'Alfaiataria Chic',
          description: 'Casaco estruturado',
          imageUrl: localImage(require('@/assets/images/quiz/q1-a.png')),
          style: 'CLASSIC',
        },
        {
          id: 'q1-option2',
          label: 'Casual Alinhado',
          description: 'Blusa Branca + Calça Jeans',
          imageUrl: localImage(require('@/assets/images/quiz/q1-b.png')),
          style: 'CASUAL',
        },
      ],
    },
    {
      id: 'q2',
      question: 'E num evento mais informal?',
      order: 2,
      options: [
        {
          id: 'q2-option1',
          label: 'Vestido',
          description: 'Vestido Florido',
          imageUrl: localImage(require('@/assets/images/quiz/q2-a.png')),
          style: 'ROMANTIC',
        },
        {
          id: 'q2-option2',
          label: 'Vestido',
          description: 'Vestido All Black',
          imageUrl: localImage(require('@/assets/images/quiz/q2-b.png')),
          style: 'REFINED',
        },
      ],
    },
    {
      id: 'q3',
      question: 'Qual desses você calçaria hoje?',
      order: 3,
      options: [
        {
          id: 'q3-option1',
          label: 'Tenis',
          description: 'Tenis preto com branco',
          imageUrl: localImage(require('@/assets/images/quiz/q3-a.png')),
          style: 'CASUAL',
        },
        {
          id: 'q3-option2',
          label: 'Sapatilha',
          description: 'Sapatilha de bico fino',
          imageUrl: localImage(require('@/assets/images/quiz/q3-b.png')),
          style: 'CLASSIC',
        },
      ],
    },
    {
      id: 'q4',
      question: 'E pra uma festa?',
      order: 4,
      options: [
        {
          id: 'q4-option1',
          label: 'Jaqueta',
          description: 'Jaqueta em couro',
          imageUrl: localImage(require('@/assets/images/quiz/q4-a.png')),
          style: 'DRAMATIC',
        },
        {
          id: 'q4-option2',
          label: 'Jaqueta',
          description: 'Jaqueta Terracota',
          imageUrl: localImage(require('@/assets/images/quiz/q4-b.png')),
          style: 'CREATIVE',
        },
      ],
    },
  ],
};

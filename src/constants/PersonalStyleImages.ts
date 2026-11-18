import type { PersonalStyle, QuizStyle } from '@/types/IdentifiedStyle';

export const PERSONAL_STYLE_IMAGES: Record<PersonalStyle, string> = {
  CLASSICO: 'https://images.pexels.com/photos/32639448/pexels-photo-32639448.jpeg',
  CASUAL:
    'https://images.pexels.com/photos/31747194/pexels-photo-31747194.jpeg?auto=compress&cs=tinysrgb&w=900',
  CRIATIVO: 'https://images.pexels.com/photos/23602561/pexels-photo-23602561.jpeg',
  ROMANTICO: 'https://images.pexels.com/photos/16846962/pexels-photo-16846962.jpeg',
  REFINADO:
    'https://images.pexels.com/photos/7959596/pexels-photo-7959596.jpeg?auto=compress&cs=tinysrgb&w=900',
  SENSUAL: 'https://images.pexels.com/photos/14722448/pexels-photo-14722448.jpeg',
  DRAMATICO:
    'https://images.pexels.com/photos/33347574/pexels-photo-33347574.jpeg?auto=compress&cs=tinysrgb&w=900',
  MINIMALISTA: 'https://images.pexels.com/photos/18356481/pexels-photo-18356481.jpeg',
  BOHO: 'https://images.pexels.com/photos/5447532/pexels-photo-5447532.jpeg?auto=compress&cs=tinysrgb&w=900',
};

// O quiz de dev mantém seus próprios valores; não há conversão de nomes de estilos.
export const QUIZ_STYLE_IMAGES: Record<QuizStyle, string> = {
  CASUAL: PERSONAL_STYLE_IMAGES.CASUAL,
  ELEGANTE:
    'https://images.pexels.com/photos/7959596/pexels-photo-7959596.jpeg?auto=compress&cs=tinysrgb&w=900',
  ESPORTIVO:
    'https://images.pexels.com/photos/16701762/pexels-photo-16701762.jpeg?auto=compress&cs=tinysrgb&w=900',
  ROMANTICO: PERSONAL_STYLE_IMAGES.ROMANTICO,
  MINIMALISTA: PERSONAL_STYLE_IMAGES.MINIMALISTA,
  BOHO: PERSONAL_STYLE_IMAGES.BOHO,
};

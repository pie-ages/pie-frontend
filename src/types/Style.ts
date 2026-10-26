export type Style =
  'romantico' | 'criativo' | 'casual' | 'classico' | 'refinado' | 'dramatico' | 'sensual';

export const STYLES: Style[] = [
  'romantico',
  'criativo',
  'casual',
  'classico',
  'refinado',
  'dramatico',
  'sensual',
];

export const STYLE_LABELS: Record<Style, string> = {
  romantico: 'Romântico',
  criativo: 'Criativo',
  casual: 'Casual',
  classico: 'Clássico',
  refinado: 'Refinado',
  dramatico: 'Dramático',
  sensual: 'Sensual',
};

export const STYLE_DESCRIPTIONS: Record<Style, string> = {
  romantico: 'Peças delicadas, cores suaves e detalhes leves.',
  criativo: 'Combinações originais, cores marcantes e muita personalidade.',
  casual: 'Conforto, praticidade e peças fáceis de combinar.',
  classico: 'Peças atemporais, cortes alinhados e combinações elegantes.',
  refinado: 'Acabamentos sofisticados, tecidos nobres e visual impecável.',
  dramatico: 'Contrastes fortes, formas marcantes e presença.',
  sensual: 'Silhuetas valorizadas, confiança e detalhes envolventes.',
};

export const STYLE_BACKGROUNDS: Record<Style, string> = {
  romantico: '#F4D7DE',
  criativo: '#FFD98E',
  casual: '#CFE8E0',
  classico: '#E4DED3',
  refinado: '#D9C9A8',
  dramatico: '#3A2E39',
  sensual: '#6E263D',
};

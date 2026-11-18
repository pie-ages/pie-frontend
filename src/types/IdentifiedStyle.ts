export const PERSONAL_STYLES = [
  'CLASSICO',
  'CASUAL',
  'CRIATIVO',
  'ROMANTICO',
  'REFINADO',
  'SENSUAL',
  'DRAMATICO',
  'MINIMALISTA',
  'BOHO',
] as const;

export const IDENTIFIED_STYLES = [...PERSONAL_STYLES, 'ELEGANTE', 'ESPORTIVO'] as const;

export type IdentifiedStyle = (typeof IDENTIFIED_STYLES)[number];

export const IDENTIFIED_STYLE_INFO: Record<
  IdentifiedStyle,
  { label: string; description: string; background: string; highlight: string }
> = {
  CLASSICO: {
    label: 'Clássico',
    description: 'Peças atemporais, cortes alinhados e combinações elegantes.',
    background: '#E4DED3',
    highlight: '#526B41',
  },
  CRIATIVO: {
    label: 'Criativo',
    description: 'Combinações originais, cores marcantes e muita personalidade.',
    background: '#FFD98E',
    highlight: '#6B410B',
  },
  REFINADO: {
    label: 'Refinado',
    description: 'Acabamentos sofisticados, tecidos nobres e visual impecável.',
    background: '#D9C9A8',
    highlight: '#57482D',
  },
  SENSUAL: {
    label: 'Sensual',
    description: 'Silhuetas valorizadas, confiança e detalhes envolventes.',
    background: '#F4D7DE',
    highlight: '#6E263D',
  },
  DRAMATICO: {
    label: 'Dramático',
    description: 'Contrastes fortes, formas marcantes e presença.',
    background: '#E5DCE5',
    highlight: '#3A2E39',
  },
  CASUAL: {
    label: 'Casual',
    description: 'Conforto, praticidade e peças fáceis de combinar.',
    background: '#CFE8E0',
    highlight: '#226B62',
  },
  ELEGANTE: {
    label: 'Elegante',
    description: 'Cortes alinhados, acabamentos cuidados e um visual sofisticado.',
    background: '#E4DED3',
    highlight: '#526B41',
  },
  ESPORTIVO: {
    label: 'Esportivo',
    description: 'Peças funcionais, movimento e conforto para o dia a dia.',
    background: '#D2E7F3',
    highlight: '#245784',
  },
  ROMANTICO: {
    label: 'Romântico',
    description: 'Peças delicadas, cores suaves e detalhes leves.',
    background: '#F4D7DE',
    highlight: '#8B3657',
  },
  MINIMALISTA: {
    label: 'Minimalista',
    description: 'Linhas simples, cores neutras e escolhas essenciais.',
    background: '#E8E8E3',
    highlight: '#4F6056',
  },
  BOHO: {
    label: 'Boho',
    description: 'Texturas, formas soltas e combinações com personalidade.',
    background: '#F1D5B8',
    highlight: '#7C4A35',
  },
};

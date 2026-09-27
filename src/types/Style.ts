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

const DEFAULT_STYLE: Style = 'classico';

export function resolveStyle(styles: string[]): Style {
  const [primary] = styles;
  return STYLES.includes(primary as Style) ? (primary as Style) : DEFAULT_STYLE;
}

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

export function resolveStyles(styles: string[]): Style[] {
  const valid = STYLES.filter((style) => styles.includes(style));
  return valid.length > 0 ? valid : [DEFAULT_STYLE];
}

export const QUIZ_STYLE_CODE_MAP: Record<string, Style> = {
  CLASSIC: 'classico',
  CASUAL: 'casual',
  ROMANTIC: 'romantico',
  REFINED: 'refinado',
  DRAMATIC: 'dramatico',
  CREATIVE: 'criativo',
  SENSUAL: 'sensual',
};

export function resolveStyleFromQuizCodes(codes: string[]): Style {
  const tally = new Map<Style, number>();

  for (const code of codes) {
    const style = QUIZ_STYLE_CODE_MAP[code];
    if (!style) continue;
    tally.set(style, (tally.get(style) ?? 0) + 1);
  }

  let winner: Style | null = null;
  let winnerCount = 0;
  for (const [style, count] of tally) {
    if (count > winnerCount) {
      winner = style;
      winnerCount = count;
    }
  }

  return winner ?? DEFAULT_STYLE;
}

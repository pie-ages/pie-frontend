const LAYERS: { rank: number; keywords: string[] }[] = [
  { rank: 4, keywords: ['tenis', 'sapat', 'sandal', 'bota', 'scarpin', 'calcado', 'chinelo'] },
  { rank: 0, keywords: ['casaco', 'jaqueta', 'blazer', 'moletom', 'sobretudo', 'cardigan'] },
  { rank: 1, keywords: ['camisa', 'camiseta', 'blusa', 'regata', 'cima'] },
  { rank: 2, keywords: ['vestido', 'macac'] },
  { rank: 3, keywords: ['calca', 'saia', 'short', 'bermuda', 'legging', 'baixo'] },
];

const UNKNOWN_RANK = 5;
const ACCENT_MARKS = /[̀-ͯ]/g;

export function lookPieceRank(category: string | null | undefined): number {
  const normalized = (category ?? '').normalize('NFD').replace(ACCENT_MARKS, '').toLowerCase();
  const layer = LAYERS.find(({ keywords }) => keywords.some((word) => normalized.includes(word)));
  return layer?.rank ?? UNKNOWN_RANK;
}

export function sortLookPieces<T extends { category?: string | null }>(pieces: T[]): T[] {
  return pieces
    .map((piece, index) => ({ piece, index }))
    .sort(
      (a, b) =>
        lookPieceRank(a.piece.category) - lookPieceRank(b.piece.category) || a.index - b.index,
    )
    .map(({ piece }) => piece);
}

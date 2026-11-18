import type { WardrobePiece } from '@/types/Look';
import { lookPieceRank } from '@/utils/look-order';

function compositionKeys(piece: WardrobePiece): string[] {
  switch (lookPieceRank(piece.category)) {
    case 0:
      return ['outerwear'];
    case 1:
      return ['top'];
    case 2:
      return ['top', 'bottom'];
    case 3:
      return ['bottom'];
    case 4:
      return ['footwear'];
  }
  const category = piece.category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  return category && category !== 'outros' ? [`category:${category}`] : [];
}

export function compatibleLookSuggestions(
  candidates: WardrobePiece[],
  selected: WardrobePiece[],
  limit: number,
): WardrobePiece[] {
  const ids = new Set(selected.map((piece) => piece.id));
  const occupied = new Set(selected.flatMap(compositionKeys));
  const suggestions: WardrobePiece[] = [];

  for (const piece of candidates) {
    if (suggestions.length >= limit) break;
    const keys = compositionKeys(piece);
    if (ids.has(piece.id) || keys.some((key) => occupied.has(key))) continue;
    suggestions.push(piece);
    ids.add(piece.id);
    keys.forEach((key) => occupied.add(key));
  }
  return suggestions;
}

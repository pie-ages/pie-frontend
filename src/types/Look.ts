export type LookPiece = {
  id: string;
  name: string;
  category: 'Parte de cima' | 'Parte de baixo' | 'Calçados';
  color: string;
};

export type LookDraft = { name: string; items: LookPiece[] };

export function validateLook(draft: LookDraft): string | null {
  if (!draft.items.length) return 'Adicione pelo menos uma peça ao look.';
  if (!draft.name.trim()) return 'Informe o nome do look.';
  if (draft.name.trim().length > 60) return 'Use até 60 caracteres no nome.';
  return null;
}

export function toggleLookPiece(items: LookPiece[], piece: LookPiece): LookPiece[] {
  return items.some((item) => item.id === piece.id)
    ? items.filter((item) => item.id !== piece.id)
    : [...items, piece];
}

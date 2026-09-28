export type LookItem = {
  id: string;
  name?: string;
  imageUrl: string | null;
};

export type Look = {
  id: string;
  name: string;
  imageUrl: string | null;
  style?: string;
  occasion?: string;
  items: LookItem[];
};

export type LooksPage = {
  items: Look[];
  total: number;
  page: number;
  size: number;
};

export type LooksViewMode = 'grid' | 'focus';

export type WardrobePiece = LookItem & {
  category: 'Parte de cima' | 'Parte de baixo' | 'Calçados';
};

export type LookDraft = {
  name: string;
  description: string;
  items: WardrobePiece[];
};

export const MAX_LOOK_PIECES = 3;

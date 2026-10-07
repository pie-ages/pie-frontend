import type { LookResponse } from '@/schemas/lookSchema';

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

export function mapLook(look: LookResponse): Look {
  return {
    id: look.id,
    name: look.title,
    imageUrl: look.photoUrl,
    occasion: look.occasion ?? undefined,
    items: look.items.map((item, index) => ({
      id: item.wardrobeItemId ?? item.productId ?? `${look.id}-${index}`,
      name: item.name ?? undefined,
      imageUrl: item.imageUrl,
    })),
  };
}

export function appendLookPage(current: Look[], next: Look[]): Look[] {
  const ids = new Set(current.map((look) => look.id));
  return [
    ...current,
    ...next.filter((look) => {
      if (ids.has(look.id)) return false;
      ids.add(look.id);
      return true;
    }),
  ];
}

export type LooksPage = {
  items: Look[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
};

export type LooksViewMode = 'grid' | 'focus';

export type WardrobePiece = LookItem & {
  category: string;
  wardrobeItemId?: string | null;
  productId?: string | null;
};

export type LookDraft = {
  name: string;
  description: string;
  items: WardrobePiece[];
};

export const MAX_LOOK_PIECES = 3;

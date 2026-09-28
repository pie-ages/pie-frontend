import { apiGetAuth } from '@/api/client';
import type { WardrobePiece } from '@/types/look';

type WardrobeItemDTO = {
  id: string;
  productId: string | null;
  category: string | null;
  color: string | null;
  photoUrl: string | null;
};

function toPiece(item: WardrobeItemDTO): WardrobePiece {
  const category = item.category?.trim() || 'Outros';
  const name = [item.category, item.color].filter(Boolean).join(' · ') || 'Peça';
  return {
    id: item.id,
    name,
    imageUrl: item.photoUrl,
    category,
    wardrobeItemId: item.id,
    productId: null,
  };
}

export function fetchWardrobeItems(): Promise<WardrobePiece[]> {
  return apiGetAuth<WardrobeItemDTO[]>('/api/users/me/wardrobe/items').then((items) =>
    items.map(toPiece),
  );
}

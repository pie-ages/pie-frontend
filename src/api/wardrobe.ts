import { apiGetAuth, apiUploadAuth } from '@/api/client';
import type { WardrobePiece } from '@/types/look';

export type WardrobeItemDTO = {
  id: string;
  name: string;
  productId: string | null;
  category: string | null;
  style: string | null;
  color: string | null;
  photoUrl: string | null;
};

export type CreateWardrobeItemPayload = {
  productId?: string | null;
  name: string;
  category: string;
  style?: string | null;
  color?: string | null;
};

export type WardrobeImageAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
};

function toPiece(item: WardrobeItemDTO): WardrobePiece {
  const category = item.category?.trim() || 'Outros';
  const name =
    item.name?.trim() || [item.category, item.color].filter(Boolean).join(' · ') || 'Peça';
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

export function createWardrobeItem(
  payload: CreateWardrobeItemPayload,
  image: WardrobeImageAsset,
): Promise<WardrobeItemDTO> {
  const formData = new FormData();
  formData.append('item', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  formData.append('file', {
    uri: image.uri,
    name: image.fileName ?? `wardrobe-${Date.now()}.jpg`,
    type: image.mimeType ?? 'image/jpeg',
  } as unknown as Blob);

  return apiUploadAuth<WardrobeItemDTO>('/api/users/me/wardrobe/items', formData);
}

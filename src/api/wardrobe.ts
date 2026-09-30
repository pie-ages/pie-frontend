import { apiGetAuth, apiUploadAuth } from '@/api/client';
import type { WardrobePiece } from '@/types/look';
import { groupWardrobePieces, type WardrobeFetch } from '@/utils/wardrobe-rows';

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

export async function fetchWardrobeItems(signal?: AbortSignal): Promise<WardrobePiece[]> {
  const items = await apiGetAuth<WardrobeItemDTO[]>('/api/users/me/wardrobe/items', signal);
  if (!Array.isArray(items) || !items.every((item) => typeof item?.id === 'string')) {
    throw new Error('Resposta inválida ao carregar o guarda-roupa.');
  }
  return items.map(toPiece);
}

export async function createWardrobeItem(
  payload: CreateWardrobeItemPayload,
  image: WardrobeImageAsset,
): Promise<WardrobeItemDTO> {
  const imageResponse = await fetch(image.uri);
  if (!imageResponse.ok) throw new Error('Não foi possível ler a foto selecionada.');
  const imageBlob = await imageResponse.blob();
  const formData = new FormData();
  formData.append('item', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  formData.append(
    'file',
    imageBlob.slice(0, imageBlob.size, image.mimeType ?? (imageBlob.type || 'image/jpeg')),
    image.fileName ?? `wardrobe-${Date.now()}.jpg`,
  );

  return apiUploadAuth<WardrobeItemDTO>('/api/users/me/wardrobe/items', formData);
}

export const fetchWardrobe: WardrobeFetch = async ({ signal }) =>
  groupWardrobePieces(await fetchWardrobeItems(signal));

import { Platform } from 'react-native';

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

export type WardrobeImageAnalysis = {
  category: string;
  style: string;
  color: string;
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
  const formData = await imageFormData(image);
  formData.append('item', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  return apiUploadAuth<WardrobeItemDTO>('/api/users/me/wardrobe/items', formData);
}

export async function analyzeWardrobeImage(
  image: WardrobeImageAsset,
  signal?: AbortSignal,
): Promise<WardrobeImageAnalysis> {
  const formData = await imageFormData(image, signal);
  return apiUploadAuth<WardrobeImageAnalysis>(
    '/api/users/me/wardrobe/items/analyze',
    formData,
    signal,
  );
}

export async function imageFormData(
  image: WardrobeImageAsset,
  signal?: AbortSignal,
  fallbackName = `wardrobe-${Date.now()}.jpg`,
): Promise<FormData> {
  const formData = new FormData();
  const fileName = image.fileName ?? fallbackName;
  if (Platform.OS !== 'web') {
    formData.append('file', {
      uri: image.uri,
      name: fileName,
      type: image.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
    return formData;
  }
  const imageResponse = await fetch(image.uri, { signal });
  if (!imageResponse.ok) throw new Error('Não foi possível ler a foto selecionada.');
  const imageBlob = await imageResponse.blob();
  formData.append(
    'file',
    imageBlob.slice(0, imageBlob.size, image.mimeType ?? (imageBlob.type || 'image/jpeg')),
    fileName,
  );
  return formData;
}

export const fetchWardrobe: WardrobeFetch = async ({ signal }) =>
  groupWardrobePieces(await fetchWardrobeItems(signal));

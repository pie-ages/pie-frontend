import {
  lookResponseSchema,
  looksPageResponseSchema,
  lookSuggestionResponseSchema,
  type LookResponse,
} from '@/schemas/lookSchema';
import { apiGetAuth, apiPostAuth, apiUploadAuth, parseResponse } from '@/services/client';
import { imageFormData, type WardrobeImageAsset } from '@/services/wardrobe';
import { mapLook, type LooksPage, type WardrobePiece } from '@/types/Look';

export type LookImageAsset = WardrobeImageAsset;

type CreateLookPayload = {
  title: string;
  description?: string;
  occasion?: string;
  wardrobeItemIds: string[];
  productIds: string[];
};

export async function fetchLooks(page: number, signal?: AbortSignal): Promise<LooksPage> {
  const qs = new URLSearchParams({ page: String(page), size: '20', sort: 'createdAt,DESC' });
  const data = parseResponse(
    looksPageResponseSchema,
    await apiGetAuth(`/api/users/me/looks?${qs}`, signal),
    'Resposta inválida ao carregar os looks.',
  );

  return { ...data, items: data.items.map(mapLook) };
}

export async function createLook(payload: CreateLookPayload): Promise<LookResponse> {
  return parseResponse(
    lookResponseSchema,
    await apiPostAuth('/api/users/me/looks', payload),
    'Resposta inválida ao criar o look.',
  );
}

export async function fetchLookSuggestion(): Promise<WardrobePiece[]> {
  const data = parseResponse(
    lookSuggestionResponseSchema,
    await apiGetAuth('/api/users/me/looks/suggestion'),
    'Resposta inválida ao carregar a sugestão de look.',
  );

  return data.items.map((item) => ({
    id: item.wardrobeItemId || item.productId!,
    name: item.name || 'Peça',
    imageUrl: item.imageUrl,
    category: item.category?.trim() || 'Outros',
    wardrobeItemId: item.wardrobeItemId,
    productId: item.productId,
  }));
}

export async function uploadLookImage(
  lookId: string,
  image: LookImageAsset,
): Promise<LookResponse> {
  const formData = await imageFormData(image, undefined, 'look.jpg');
  return parseResponse(
    lookResponseSchema,
    await apiUploadAuth(`/api/users/me/looks/${encodeURIComponent(lookId)}/image`, formData),
  );
}

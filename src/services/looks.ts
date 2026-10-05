import { apiGetAuth, apiPostAuth, apiUploadAuth } from '@/services/client';
import { imageFormData, type WardrobeImageAsset } from '@/services/wardrobe';
import { mapLook, type LookResponse, type LooksPage, type WardrobePiece } from '@/types/Look';

export type LookImageAsset = WardrobeImageAsset;

type CreateLookPayload = {
  title: string;
  description?: string;
  occasion?: string;
  wardrobeItemIds: string[];
  productIds: string[];
};

type LookSuggestionResponse = {
  items: (LookResponse['items'][number] & { category: string | null })[];
};

type LooksResponse = {
  items: LookResponse[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
};

export async function fetchLooks(page: number, signal?: AbortSignal): Promise<LooksPage> {
  const qs = new URLSearchParams({ page: String(page), size: '20', sort: 'createdAt,DESC' });
  const data = await apiGetAuth<LooksResponse>(`/api/users/me/looks?${qs}`, signal);
  if (
    !Array.isArray(data?.items) ||
    typeof data.page !== 'number' ||
    typeof data.hasNext !== 'boolean' ||
    !data.items.every(
      (look) =>
        typeof look?.id === 'string' && typeof look.title === 'string' && Array.isArray(look.items),
    )
  ) {
    throw new Error('Resposta inválida ao carregar os looks.');
  }

  return { ...data, items: data.items.map(mapLook) };
}

export async function createLook(payload: CreateLookPayload): Promise<LookResponse> {
  const look = await apiPostAuth<LookResponse>('/api/users/me/looks', payload);
  if (typeof look?.id !== 'string' || !look.id) {
    throw new Error('Resposta inválida ao criar o look.');
  }
  return look;
}

export async function fetchLookSuggestion(): Promise<WardrobePiece[]> {
  const data = await apiGetAuth<LookSuggestionResponse>('/api/users/me/looks/suggestion');
  if (
    !Array.isArray(data?.items) ||
    !data.items.every(
      (item) =>
        (typeof item?.wardrobeItemId === 'string' && !!item.wardrobeItemId) ||
        (typeof item?.productId === 'string' && !!item.productId),
    )
  ) {
    throw new Error('Resposta inválida ao carregar a sugestão de look.');
  }

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
  return apiUploadAuth<LookResponse>(
    `/api/users/me/looks/${encodeURIComponent(lookId)}/image`,
    formData,
  );
}

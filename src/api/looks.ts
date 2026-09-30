import axios from 'axios';

import { apiGetAuth, apiPostAuth, apiUploadAuth } from '@/api/client';
import { mapLook, type LookResponse, type LooksPage, type WardrobePiece } from '@/types/look';
import { getStoredToken } from '@/utils/auth-storage';

export type LookImageAsset = {
  uri: string;
  type?: string;
  fileName?: string;
};

type LookItemResponse = {
  wardrobeItemId: string | null;
  productId: string | null;
  name: string | null;
  category: string;
  imageUrl: string | null;
};

export async function createLook(dto: {
  title: string;
  description: string;
  wardrobeItemIds: string[];
  productIds: string[];
}): Promise<{ id: string }> {
  return apiPostAuth<{ id: string }>('/api/users/me/looks', dto);
}

export async function uploadLookImage(lookId: string, image: LookImageAsset): Promise<void> {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.type ?? 'image/jpeg',
    name: image.fileName ?? 'look.jpg',
  } as unknown as Blob);
  return apiUploadAuth<void>(`/api/users/me/looks/${lookId}/image`, formData);
}

export async function fetchLookSuggestion(): Promise<WardrobePiece[]> {
  const data = await apiGetAuth<{ items: LookItemResponse[] }>('/api/users/me/looks/suggestion');
  return data.items.map((item) => ({
    id: item.wardrobeItemId ?? item.productId ?? '',
    name: item.name ?? undefined,
    imageUrl: item.imageUrl,
    category: item.category,
    wardrobeItemId: item.wardrobeItemId,
    productId: item.productId,
  }));
}

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

type LooksResponse = {
  items: LookResponse[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
};

export async function fetchLooks(page: number, signal?: AbortSignal): Promise<LooksPage> {
  const token = await getStoredToken();
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.');

  const response = await axios.get<LooksResponse>(`${API_URL}/api/users/me/looks`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size: 20, sort: 'createdAt,DESC' },
    signal,
  });
  const data = response.data;
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

import axios from 'axios';
import { Platform } from 'react-native';

import { apiGetAuth, apiPostAuth, apiUploadAuth } from '@/api/client';
import type { WardrobeImageAsset } from '@/api/wardrobe';
import { mapLook, type LookResponse, type LooksPage, type WardrobePiece } from '@/types/look';
import { getStoredToken } from '@/utils/auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

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
  const formData = new FormData();
  const fileName = image.fileName ?? 'look.jpg';

  if (Platform.OS === 'web') {
    const response = await fetch(image.uri);
    if (!response.ok) throw new Error('Não foi possível ler a foto selecionada.');
    const blob = await response.blob();
    formData.append(
      'file',
      blob.slice(0, blob.size, image.mimeType ?? (blob.type || 'image/jpeg')),
      fileName,
    );
  } else {
    // React Native envia arquivos locais usando uri, name e type no multipart.
    formData.append('file', {
      uri: image.uri,
      name: fileName,
      type: image.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
  }

  return apiUploadAuth<LookResponse>(
    `/api/users/me/looks/${encodeURIComponent(lookId)}/image`,
    formData,
  );
}

import { Platform } from 'react-native';

import { apiGetAuth, apiPostAuth, apiUploadAuth } from '@/api/client';
import type { WardrobePiece } from '@/types/look';

export type CreateLookPayload = {
  title: string;
  description: string;
  wardrobeItemIds: string[];
  productIds: string[];
};

export type CreatedLook = {
  id: string;
  title: string;
};

export type LookImageAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

type LookItemDTO = {
  wardrobeItemId: string | null;
  productId: string | null;
  name: string | null;
  category: string | null;
  color: string | null;
  imageUrl: string | null;
};

function toPiece(item: LookItemDTO): WardrobePiece {
  const category = item.category?.trim() || 'Outros';
  const name =
    item.name?.trim() || [item.category, item.color].filter(Boolean).join(' · ') || 'Peça';
  return {
    id: (item.wardrobeItemId ?? item.productId) as string,
    name,
    imageUrl: item.imageUrl,
    category,
    wardrobeItemId: item.wardrobeItemId,
    productId: item.productId,
  };
}

export function createLook(payload: CreateLookPayload): Promise<CreatedLook> {
  return apiPostAuth<CreatedLook>('/api/users/me/looks', {
    title: payload.title,
    description: payload.description,
    occasion: null,
    wardrobeItemIds: payload.wardrobeItemIds,
    productIds: payload.productIds,
  });
}

export async function uploadLookImage(lookId: string, asset: LookImageAsset): Promise<void> {
  const form = new FormData();
  const name = asset.fileName ?? `look-${lookId}.jpg`;
  const type = asset.mimeType ?? 'image/jpeg';
  if (Platform.OS === 'web') {
    const blob = await fetch(asset.uri).then((response) => response.blob());
    form.append('file', blob, name);
  } else {
    form.append('file', { uri: asset.uri, name, type } as unknown as Blob);
  }
  return apiUploadAuth<void>(`/api/users/me/looks/${lookId}/image`, form);
}

export function fetchLookSuggestion(): Promise<WardrobePiece[]> {
  return apiGetAuth<{ items: LookItemDTO[] }>('/api/users/me/looks/suggestion').then((data) =>
    data.items.map(toPiece),
  );
}

import axios from 'axios';

import { apiGetAuth, apiUploadAuth } from '@/api/client';
import type { WardrobePiece } from '@/types/look';
import { getStoredToken } from '@/utils/auth-storage';
import type { WardrobeFetch } from '@/utils/wardrobe-rows';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';
const WARDROBE_PAGE_SIZE = 20;

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

type WardrobeResponse = {
  rows: { id: string; title: string; items: WardrobeItemDTO[]; hasNext: boolean }[];
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

export const fetchWardrobe: WardrobeFetch = async ({ category, page, signal }) => {
  const token = await getStoredToken();
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.');

  const response = await axios.get<WardrobeResponse>(`${API_URL}/api/users/me/wardrobe`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { category, page, size: WARDROBE_PAGE_SIZE },
    signal,
  });
  const rows = response.data?.rows;
  if (
    !Array.isArray(rows) ||
    !rows.every(
      (row) =>
        typeof row?.id === 'string' &&
        typeof row.title === 'string' &&
        typeof row.hasNext === 'boolean' &&
        Array.isArray(row.items) &&
        row.items.every((item) => typeof item?.id === 'string'),
    )
  ) {
    throw new Error('Resposta inválida ao carregar o guarda-roupa.');
  }

  return rows.map((row) => ({ ...row, items: row.items.map(toPiece) }));
};

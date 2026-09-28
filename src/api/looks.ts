import axios from 'axios';

import { mapLook, type LookResponse, type LooksPage } from '@/types/look';
import { getStoredToken } from '@/utils/auth-storage';

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

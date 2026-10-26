import { userProductStylesSchema } from '@/schemas/profileSchema';
import { apiGetAuth, apiPutAuth, parseResponse } from '@/services/client';
import { STYLES, type Style } from '@/types/Style';

function normalizeStyles(styles: string[]): Style[] {
  return styles.map((style) => {
    const normalized = STYLES.find((candidate) => candidate.toUpperCase() === style.toUpperCase());
    if (!normalized) throw new Error('A API retornou um estilo inválido.');
    return normalized;
  });
}

export async function fetchUserProductStyles(): Promise<Style[]> {
  const response = parseResponse(
    userProductStylesSchema,
    await apiGetAuth('/api/users/me/product-styles'),
  );
  return normalizeStyles(response.styles);
}

export async function updateUserProductStyles(styles: Style[]): Promise<Style[]> {
  const response = parseResponse(
    userProductStylesSchema,
    await apiPutAuth('/api/users/me/product-styles', { styles }),
  );
  return normalizeStyles(response.styles);
}

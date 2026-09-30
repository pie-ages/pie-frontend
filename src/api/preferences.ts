import { apiGetAuth, apiPutAuth } from '@/api/client';
import type { ColorimetryPreferences } from '@/types/colorimetry';

export function fetchPreferences(): Promise<ColorimetryPreferences> {
  return apiGetAuth<ColorimetryPreferences>('/api/users/me/preferences');
}

export function updateFavoriteColors(
  favoriteColors: string[],
): Promise<ColorimetryPreferences | undefined> {
  return apiPutAuth<ColorimetryPreferences | undefined>('/api/users/me/preferences', {
    favoriteColors,
  });
}

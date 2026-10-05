import { apiGetAuth, apiPutAuth } from '@/services/client';
import type { ColorimetryPreferences } from '@/types/Colorimetry';

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

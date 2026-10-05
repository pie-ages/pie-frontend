import {
  colorimetryPreferencesSchema,
  type ColorimetryPreferences,
} from '@/schemas/colorimetrySchema';
import { apiGetAuth, apiPutAuth, parseResponse } from '@/services/client';

export async function fetchPreferences(): Promise<ColorimetryPreferences> {
  return parseResponse(colorimetryPreferencesSchema, await apiGetAuth('/api/users/me/preferences'));
}

export async function updateFavoriteColors(
  favoriteColors: string[],
): Promise<ColorimetryPreferences | undefined> {
  return parseResponse(
    colorimetryPreferencesSchema.optional(),
    await apiPutAuth('/api/users/me/preferences', { favoriteColors }),
  );
}

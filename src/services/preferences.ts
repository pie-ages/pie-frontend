import {
  colorimetryPreferencesSchema,
  type ColorimetryPreferences,
} from '@/schemas/colorimetrySchema';
import { apiGetAuth, apiPutAuth, apiUploadAuth, parseResponse } from '@/services/client';
import { imageFormData, type WardrobeImageAsset } from '@/services/wardrobe';

export async function fetchPreferences(signal?: AbortSignal): Promise<ColorimetryPreferences> {
  return parseResponse(
    colorimetryPreferencesSchema,
    await apiGetAuth('/api/users/me/preferences', signal),
  );
}

export async function analyzeColorimetry(
  photo: WardrobeImageAsset,
  signal?: AbortSignal,
): Promise<ColorimetryPreferences> {
  const formData = await imageFormData(photo, signal, `colorimetry-${Date.now()}.jpg`);
  return parseResponse(
    colorimetryPreferencesSchema,
    await apiUploadAuth('/api/users/me/colorimetry', formData, signal),
  );
}

export async function updateFavoriteColors(
  favoriteColors: string[],
): Promise<ColorimetryPreferences | undefined> {
  return parseResponse(
    colorimetryPreferencesSchema.optional(),
    await apiPutAuth('/api/users/me/preferences', { favoriteColors }),
  );
}

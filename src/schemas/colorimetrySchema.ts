import { z } from 'zod';

export const colorimetrySeasonSchema = z.object({
  id: z.string(),
  label: z.string(),
  highlightCaption: z.string(),
  avoidCaption: z.string(),
});

export const colorimetryPreferencesSchema = z.object({
  highlightColors: z.array(z.string()),
  avoidColors: z.array(z.string()),
  favoriteColors: z.array(z.string()),
  season: colorimetrySeasonSchema.nullish(),
});

export type ColorimetryPreferences = z.infer<typeof colorimetryPreferencesSchema>;

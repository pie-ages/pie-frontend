import { z } from 'zod';

export const colorimetryPreferencesSchema = z.object({
  highlightColors: z.array(z.string()),
  avoidColors: z.array(z.string()),
  favoriteColors: z.array(z.string()),
});

export type ColorimetryPreferences = z.infer<typeof colorimetryPreferencesSchema>;

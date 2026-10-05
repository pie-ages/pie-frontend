import { z } from 'zod';

import type { WardrobePiece } from '@/types/Look';

export const lookFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe o nome do look.'),
  occasion: z.string().trim(),
  items: z.array(z.custom<WardrobePiece>()).min(1, 'Adicione pelo menos uma peça ao look.'),
});

export type LookFormData = z.infer<typeof lookFormSchema>;

export const lookItemResponseSchema = z.object({
  wardrobeItemId: z.string().nullable(),
  productId: z.string().nullable(),
  name: z.string().nullable(),
  category: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

export const lookResponseSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  occasion: z.string().nullable(),
  photoUrl: z.string().nullable(),
  items: z.array(lookItemResponseSchema),
});

export const looksPageResponseSchema = z.object({
  items: z.array(lookResponseSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  hasNext: z.boolean(),
});

export const lookSuggestionResponseSchema = z.object({
  items: z.array(
    lookItemResponseSchema.refine((item) => !!item.wardrobeItemId || !!item.productId),
  ),
});

export type LookResponse = z.infer<typeof lookResponseSchema>;

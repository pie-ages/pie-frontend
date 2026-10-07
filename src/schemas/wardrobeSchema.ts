import { z } from 'zod';

import type { WardrobeImageAsset } from '@/services/wardrobe';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const addPieceSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da peça.'),
  category: z.string().min(1, 'Selecione a categoria da peça.'),
  style: z.string(),
  color: z.string(),
  image: z
    .custom<WardrobeImageAsset | null>()
    .refine((image) => image !== null, 'Adicione uma imagem da peça.')
    .refine(
      (image) => !image?.mimeType || ALLOWED_IMAGE_TYPES.has(image.mimeType),
      'Formato não suportado. Use JPEG, PNG ou WebP.',
    )
    .refine(
      (image) => !image?.fileSize || image.fileSize <= MAX_IMAGE_SIZE_BYTES,
      'A imagem deve ter no máximo 5 MB.',
    ),
});

export type AddPieceFormInput = z.input<typeof addPieceSchema>;
export type AddPieceFormData = z.output<typeof addPieceSchema>;

export const wardrobeItemSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  productId: z.string().nullable(),
  category: z.string().nullable(),
  style: z.string().nullable(),
  color: z.string().nullable(),
  photoUrl: z.string().nullable(),
});

const analyzedField = z
  .string()
  .nullable()
  .transform((value) => value ?? '');

export const wardrobeImageAnalysisSchema = z.object({
  category: analyzedField,
  style: analyzedField,
  color: analyzedField,
});

export type WardrobeItemDTO = z.infer<typeof wardrobeItemSchema>;
export type WardrobeImageAnalysis = z.infer<typeof wardrobeImageAnalysisSchema>;

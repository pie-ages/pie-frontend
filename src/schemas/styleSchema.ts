import { z } from 'zod';

import { IDENTIFIED_STYLES } from '@/types/IdentifiedStyle';

const identifiedStyleSchema = z.enum(IDENTIFIED_STYLES);

export const styleQuizOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  imageUrl: z.string(),
  style: identifiedStyleSchema,
});

export const styleQuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  order: z.number(),
  options: z.array(styleQuizOptionSchema),
});

export const styleQuizResponseSchema = z.object({
  questions: z.array(styleQuizQuestionSchema),
});

export type StyleQuizOption = z.infer<typeof styleQuizOptionSchema>;
export type StyleQuizQuestion = z.infer<typeof styleQuizQuestionSchema>;

export const styleIdentificationSchema = z
  .object({
    styles: z.array(identifiedStyleSchema).max(1),
    touches: z.array(identifiedStyleSchema).max(2),
  })
  .refine(
    ({ styles, touches }) =>
      new Set(touches).size === touches.length &&
      (styles.length > 0 || touches.length === 0) &&
      !touches.some((style) => styles.includes(style)),
    'Essência e toques devem ser distintos e não podem existir toques sem essência.',
  );

export const favoriteStylesSchema = z.object({
  styles: z
    .array(identifiedStyleSchema)
    .refine(
      (styles) => new Set(styles).size === styles.length,
      'Estilos favoritos não podem se repetir.',
    ),
});

import { z } from 'zod';

import { IDENTIFIED_STYLES, type IdentifiedStyle } from '@/types/IdentifiedStyle';

export const styleQuizOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  imageUrl: z.string(),
  style: z.string(),
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

export const styleIdentificationSchema = z.object({
  styles: z.array(z.enum(IDENTIFIED_STYLES)).max(1),
});

function isIdentifiedStyle(style: string): style is IdentifiedStyle {
  return (IDENTIFIED_STYLES as readonly string[]).includes(style);
}

export const favoriteStylesSchema = z.object({
  styles: z.array(z.string()).transform((styles) => styles.filter(isIdentifiedStyle)),
});

import { z } from 'zod';

export const taxonomyTermSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const taxonomyResponseSchema = z.object({
  categories: z.array(taxonomyTermSchema),
  colors: z.array(taxonomyTermSchema),
  styles: z.array(taxonomyTermSchema),
  sizes: z.array(taxonomyTermSchema),
  materials: z.array(taxonomyTermSchema),
});

export const companySummarySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type TaxonomyTerm = z.infer<typeof taxonomyTermSchema>;
export type TaxonomyResponse = z.infer<typeof taxonomyResponseSchema>;
export type CompanySummary = z.infer<typeof companySummarySchema>;

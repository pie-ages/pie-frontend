import {
  taxonomyResponseSchema,
  type TaxonomyResponse,
  type TaxonomyTerm,
} from '@/schemas/taxonomySchema';

import { apiFetch, parseResponse } from './client';

export type { TaxonomyResponse, TaxonomyTerm };

let cached: TaxonomyResponse | null = null;

export async function fetchTaxonomy(): Promise<TaxonomyResponse> {
  if (cached) return cached;
  const data = parseResponse(taxonomyResponseSchema, await apiFetch('/api/taxonomy'));
  cached = data;
  return data;
}

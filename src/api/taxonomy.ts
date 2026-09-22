import { apiFetch } from './client';

export type TaxonomyTerm = {
  id: string;
  name: string;
};

export type TaxonomyResponse = {
  categories: TaxonomyTerm[];
  colors: TaxonomyTerm[];
  styles: TaxonomyTerm[];
  sizes: TaxonomyTerm[];
  materials: TaxonomyTerm[];
};

let cached: TaxonomyResponse | null = null;

export async function fetchTaxonomy(): Promise<TaxonomyResponse> {
  if (cached) return cached;
  const data = await apiFetch<TaxonomyResponse>('/api/taxonomy');
  cached = data;
  return data;
}

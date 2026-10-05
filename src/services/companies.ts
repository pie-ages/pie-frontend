import { z } from 'zod';

import { companySummarySchema, type CompanySummary } from '@/schemas/taxonomySchema';

import { apiFetch, parseResponse } from './client';

export type { CompanySummary };

let cached: CompanySummary[] | null = null;

export async function fetchCompanies(): Promise<CompanySummary[]> {
  if (cached) return cached;
  const data = parseResponse(z.array(companySummarySchema), await apiFetch('/api/companies'));
  cached = data;
  return data;
}

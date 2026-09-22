import { apiFetch } from './client';

export type CompanySummary = {
  id: string;
  name: string;
};

let cached: CompanySummary[] | null = null;

export async function fetchCompanies(): Promise<CompanySummary[]> {
  if (cached) return cached;
  const data = await apiFetch<CompanySummary[]>('/api/companies');
  cached = data;
  return data;
}

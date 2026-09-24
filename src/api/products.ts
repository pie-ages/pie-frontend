import type { CatalogPage, CatalogParams, ProductPublicDetail } from '@/types/product';

import { apiFetch } from './client';

export function fetchCatalog(params: CatalogParams = {}): Promise<CatalogPage> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  params.styles?.forEach((s) => qs.append('styles', s));
  params.categories?.forEach((c) => qs.append('categories', c));
  params.colors?.forEach((c) => qs.append('colors', c));
  params.companies?.forEach((c) => qs.append('companies', c));
  params.materials?.forEach((m) => qs.append('materials', m));
  qs.set('page', String(params.page ?? 0));
  qs.set('size', String(params.size ?? 20));
  qs.set('sort', params.sort ?? 'name,ASC');
  return apiFetch<CatalogPage>('/api/products', qs);
}

export function fetchProductDetail(id: string): Promise<ProductPublicDetail> {
  return apiFetch<ProductPublicDetail>(`/api/products/${id}/public`);
}

import type { CatalogPage, CatalogParams, ProductPublicDetail } from '@/types/Product';

import { apiFetch } from './client';

export function fetchCatalog(params: CatalogParams = {}): Promise<CatalogPage> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  params.styles?.forEach((s) => qs.append('styles', s));
  params.categories?.forEach((c) => qs.append('categories', c));
  params.colors?.forEach((c) => qs.append('colors', c));
  params.companies?.forEach((c) => qs.append('companies', c));
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.size !== undefined) qs.set('size', String(params.size));
  return apiFetch<CatalogPage>('/products', qs);
}

export function fetchProductDetail(id: string): Promise<ProductPublicDetail> {
  return apiFetch<ProductPublicDetail>(`/products/${id}/public`);
}

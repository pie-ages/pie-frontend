import {
  catalogPageSchema,
  productPublicDetailSchema,
  type CatalogPage,
  type ProductPublicDetail,
} from '@/schemas/productSchema';
import type { CatalogParams } from '@/types/Product';

import { apiFetch, parseResponse } from './client';

export async function fetchCatalog(params: CatalogParams = {}): Promise<CatalogPage> {
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
  return parseResponse(catalogPageSchema, await apiFetch('/api/products', qs));
}

export async function fetchProductDetail(id: string): Promise<ProductPublicDetail> {
  return parseResponse(
    productPublicDetailSchema,
    await apiFetch(`/api/products/${encodeURIComponent(id)}/public`),
  );
}

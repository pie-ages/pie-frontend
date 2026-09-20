import { apiFetch } from './client';

export type CatalogItem = {
  id: string;
  name: string;
  category: string | null;
  color: string | null;
  price: number;
  imageUrl: string | null;
  purchaseUrl: string;
  companyName: string | null;
  status: string;
  styles: string[];
  sizes: string[];
  materials: string[];
};

export type CatalogPage = {
  items: CatalogItem[];
  total: number;
  page: number;
  size: number;
};

export type CatalogParams = {
  search?: string;
  styles?: string[];
  categories?: string[];
  colors?: string[];
  companies?: string[];
  page?: number;
  size?: number;
};

export type ProductPublicDetail = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  color: string | null;
  price: number;
  imageUrl: string | null;
  purchaseUrl: string;
  companyName: string | null;
  styles: string[];
  sizes: string[];
  materials: string[];
  available: boolean;
};

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

export type Size = {
  label: string;
  available: boolean;
};

export type Store = {
  name: string;
  logoUrl: string;
};

export type Product = {
  id: string;
  name: string;
  color?: string;
  style?: string;
  category?: string;
  price: number;
  description: string;
  sizes: Size[];
  imageUrl: string | null;
  images: string[];
  purchaseUrl: string;
  store: Store;
  storeName: string;
  isAvailable: boolean;
};

export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroupId = 'estilos' | 'pecas' | 'cores' | 'lojas';

export type FilterGroup = {
  id: FilterGroupId;
  label: string;
  options: FilterOption[];
};

export type ProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

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
  sort?: string;
  materials?: string[];
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
  images: ProductImage[];
  inWishlist: boolean;
};

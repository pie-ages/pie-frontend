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
  price: number;
  description: string;
  sizes: Size[];
  /** Primeira imagem, usada nos cards da vitrine. */
  imageUrl: string | null;
  /** Lista completa de imagens para o carrossel na tela de detalhes. */
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

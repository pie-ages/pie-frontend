export type Store = {
  name: string;
  logoUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  /** `null` representa um produto sem imagem cadastrada. */
  imageUrl: string | null;
  purchaseUrl: string;
  store: Store;
};

export type FilterOption = {
  id: string;
  label: string;
};

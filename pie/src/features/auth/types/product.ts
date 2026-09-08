export type Product = {
  id: string;
  name: string;
  images: (string | number)[];
  description: string;
  sizes: { label: string; available: boolean }[];
  price: number;
  storeName: string;
  purchaseUrl: string;
  isAvailable: boolean;
};
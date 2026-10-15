import { z } from 'zod';

export const productImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  isPrimary: z.boolean(),
  displayOrder: z.number(),
});

export const catalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().nullable(),
  color: z.string().nullable(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  purchaseUrl: z.string(),
  companyName: z.string().nullable(),
  status: z.string(),
  styles: z.array(z.string()),
  sizes: z.array(z.string()),
  materials: z.array(z.string()),
});

export const catalogPageSchema = z.object({
  items: z.array(catalogItemSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
});

export const productPublicDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  color: z.string().nullable(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  purchaseUrl: z.string(),
  companyName: z.string().nullable(),
  styles: z.array(z.string()),
  sizes: z.array(z.string()),
  materials: z.array(z.string()),
  available: z.boolean(),
  images: z.array(productImageSchema),
  inWishlist: z.boolean(),
});

export type ProductImage = z.infer<typeof productImageSchema>;
export type CatalogItem = z.infer<typeof catalogItemSchema>;
export type CatalogPage = z.infer<typeof catalogPageSchema>;
export type ProductPublicDetail = z.infer<typeof productPublicDetailSchema>;

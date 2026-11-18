import { z } from 'zod';

export const wishlistItemSchema = z
  .object({
    productId: z.string(),
    name: z.string(),
    color: z.string().nullable(),
    price: z.number(),
    imageUrl: z.string().nullable(),
    purchaseUrl: z.string().nullable(),
    available: z.boolean(),
  })
  .transform(({ productId, ...product }) => ({ id: productId, ...product }));

export const wishlistSchema = z.object({ items: z.array(wishlistItemSchema) });

export type WishlistProduct = z.infer<typeof wishlistItemSchema>;

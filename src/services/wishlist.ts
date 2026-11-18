import { wishlistItemSchema, wishlistSchema } from '@/schemas/wishlistSchema';
import { apiDeleteAuth, apiGetAuth, apiPostAuth, parseResponse } from '@/services/client';

export async function fetchWishlist(signal?: AbortSignal) {
  return parseResponse(wishlistSchema, await apiGetAuth('/api/wishlist', signal)).items;
}

export async function addWishlistItem(productId: string) {
  return parseResponse(wishlistItemSchema, await apiPostAuth('/api/wishlist/items', { productId }));
}

export async function removeWishlistItem(productId: string) {
  await apiDeleteAuth(`/api/wishlist/items/${encodeURIComponent(productId)}`);
}

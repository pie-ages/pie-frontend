import { createContext, ReactNode, useContext, useState } from 'react';

import type { Product } from '@/types/product';

type WishlistContextValue = {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  function toggle(product: Product) {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product],
    );
  }

  function remove(productId: string) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function isInWishlist(productId: string) {
    return items.some((item) => item.id === productId);
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

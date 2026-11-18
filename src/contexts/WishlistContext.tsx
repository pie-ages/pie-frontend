import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { CatalogItem } from '@/schemas/productSchema';
import type { WishlistProduct } from '@/schemas/wishlistSchema';
import { addWishlistItem, fetchWishlist, removeWishlistItem } from '@/services/wishlist';

type WishlistContextValue = {
  items: WishlistProduct[];
  isLoading: boolean;
  canChange: boolean;
  error: string | null;
  retry: () => void;
  isPending: (productId: string) => boolean;
  toggle: (product: CatalogItem) => void;
  remove: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

type WishlistState = {
  userId: string | null;
  items: WishlistProduct[];
  isLoading: boolean;
  loaded: boolean;
  pendingIds: string[];
  error: string | null;
};

function emptyState(userId: string | null): WishlistState {
  return { userId, items: [], isLoading: !!userId, loaded: !userId, pendingIds: [], error: null };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const userId = auth.isAuthenticated ? auth.userId : null;
  const [state, setState] = useState<WishlistState>(() => emptyState(userId));
  const [attempt, setAttempt] = useState(0);
  const generation = useRef({ active: false });
  const pending = useRef(new Set<string>());

  if (state.userId !== userId) setState(emptyState(userId));

  useEffect(() => {
    const current = { active: true };
    generation.current = current;
    const controller = new AbortController();
    pending.current.clear();

    if (userId) {
      fetchWishlist(controller.signal)
        .then((items) => {
          if (!current.active) return;
          setState({ ...emptyState(userId), items, loaded: true, isLoading: false });
        })
        .catch(() => {
          if (!current.active) return;
          setState({
            ...emptyState(userId),
            isLoading: false,
            error: 'Não foi possível carregar sua Wishlist. Tente novamente.',
          });
        });
    }

    return () => {
      current.active = false;
      controller.abort();
    };
  }, [attempt, userId]);

  // Never expose the previous account's data while the new session effect is pending.
  const visible = state.userId === userId ? state : emptyState(userId);
  const canChange = !!userId && visible.loaded && !visible.isLoading;

  function mutate(
    productId: string,
    request: () => Promise<WishlistProduct | void>,
    update: (items: WishlistProduct[], product: WishlistProduct | void) => WishlistProduct[],
  ) {
    if (!canChange || pending.current.has(productId)) return;
    const current = generation.current;
    if (!current.active) return;
    pending.current.add(productId);
    setState((previous) => ({
      ...previous,
      pendingIds: [...previous.pendingIds, productId],
      error: null,
    }));

    request()
      .then((product) => {
        if (!current.active) return;
        setState((previous) => ({ ...previous, items: update(previous.items, product) }));
      })
      .catch(() => {
        if (!current.active) return;
        setState((previous) => ({
          ...previous,
          error: 'Não foi possível atualizar sua Wishlist. Tente novamente.',
        }));
      })
      .finally(() => {
        if (!current.active) return;
        pending.current.delete(productId);
        setState((previous) => ({
          ...previous,
          pendingIds: previous.pendingIds.filter((id) => id !== productId),
        }));
      });
  }

  function toggle(product: CatalogItem) {
    if (isInWishlist(product.id)) {
      remove(product.id);
      return;
    }
    mutate(
      product.id,
      () => addWishlistItem(product.id),
      (items, saved) =>
        saved ? [...items.filter((item) => item.id !== product.id), saved] : items,
    );
  }

  function remove(productId: string) {
    mutate(
      productId,
      () => removeWishlistItem(productId),
      (items) => items.filter((item) => item.id !== productId),
    );
  }

  function isInWishlist(productId: string) {
    return visible.items.some((item) => item.id === productId);
  }

  function retry() {
    if (pending.current.size === 0) {
      setState(emptyState(userId));
      setAttempt((previous) => previous + 1);
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items: visible.items,
        isLoading: visible.isLoading,
        canChange,
        error: visible.error,
        retry,
        isPending: (productId) => visible.pendingIds.includes(productId),
        toggle,
        remove,
        isInWishlist,
      }}
    >
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

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { ApiError } from '@/services/client';
import { deleteWardrobeItem, fetchWardrobe } from '@/services/wardrobe';
import { createWardrobeStore } from '@/utils/wardrobe-rows';

export function useWardrobeRows() {
  const [store] = useState(() => createWardrobeStore(fetchWardrobe));
  const state = useSyncExternalStore(store.subscribe, store.getState);

  useEffect(() => {
    void store.loadInitial();
    return store.abortAll;
  }, [store]);

  const removingIds = useRef(new Set<string>());

  const removeItem = useCallback(
    async (itemId: string) => {
      if (removingIds.current.has(itemId)) return;

      removingIds.current.add(itemId);
      try {
        await deleteWardrobeItem(itemId);
        store.removeItem(itemId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) store.removeItem(itemId);
        else throw error;
      } finally {
        removingIds.current.delete(itemId);
      }
    },
    [store],
  );

  return {
    status: state.status,
    rows: state.rowIds.map((id) => state.rows[id]),
    retry: store.loadInitial,
    loadMore: store.loadMore,
    retryRow: store.retryRow,
    removeItem,
  };
}

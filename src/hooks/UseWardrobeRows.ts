import { useEffect, useState, useSyncExternalStore } from 'react';

import { fetchWardrobe } from '@/services/wardrobe';
import { createWardrobeStore } from '@/utils/wardrobe-rows';

export function useWardrobeRows() {
  const [store] = useState(() => createWardrobeStore(fetchWardrobe));
  const state = useSyncExternalStore(store.subscribe, store.getState);

  useEffect(() => {
    void store.loadInitial();
    return store.abortAll;
  }, [store]);

  return {
    status: state.status,
    rows: state.rowIds.map((id) => state.rows[id]),
    retry: store.loadInitial,
    loadMore: store.loadMore,
    retryRow: store.retryRow,
  };
}

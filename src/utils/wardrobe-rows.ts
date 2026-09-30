import type { WardrobePiece } from '../types/look';

export type WardrobeRowPage = {
  id: string;
  title: string;
  items: WardrobePiece[];
  hasNext: boolean;
};

export function groupWardrobePieces(pieces: WardrobePiece[]): WardrobeRowPage[] {
  const rows = new Map<string, WardrobeRowPage>();
  for (const piece of pieces) {
    let row = rows.get(piece.category);
    if (!row) {
      row = { id: piece.category, title: piece.category, items: [], hasNext: false };
      rows.set(piece.category, row);
    }
    row.items.push(piece);
  }
  return [...rows.values()];
}

export type WardrobeFetch = (params: {
  category?: string;
  page: number;
  signal: AbortSignal;
}) => Promise<WardrobeRowPage[]>;

export type WardrobeRow = WardrobeRowPage & {
  page: number;
  status: 'idle' | 'loadingMore' | 'error';
};

export type WardrobeState = {
  status: 'loading' | 'success' | 'empty' | 'error';
  rowIds: string[];
  rows: Record<string, WardrobeRow>;
};

export type WardrobeAction =
  | { type: 'load' }
  | { type: 'loaded'; rows: WardrobeRowPage[] }
  | { type: 'loadFailed' }
  | { type: 'pageStart'; rowId: string }
  | { type: 'pageLoaded'; rowId: string; page: number; items: WardrobePiece[]; hasNext: boolean }
  | { type: 'pageFailed'; rowId: string };

export const INITIAL_WARDROBE_STATE: WardrobeState = { status: 'loading', rowIds: [], rows: {} };

export function appendUniquePieces(
  current: WardrobePiece[],
  next: WardrobePiece[],
): WardrobePiece[] {
  const ids = new Set(current.map((piece) => piece.id));
  return [
    ...current,
    ...next.filter((piece) => {
      if (ids.has(piece.id)) return false;
      ids.add(piece.id);
      return true;
    }),
  ];
}

function updateRow(
  state: WardrobeState,
  rowId: string,
  update: (row: WardrobeRow) => WardrobeRow,
): WardrobeState {
  const row = state.rows[rowId];
  if (!row) return state;
  return { ...state, rows: { ...state.rows, [rowId]: update(row) } };
}

export function wardrobeReducer(state: WardrobeState, action: WardrobeAction): WardrobeState {
  switch (action.type) {
    case 'load':
      return INITIAL_WARDROBE_STATE;
    case 'loaded': {
      const rows = action.rows.filter((row) => row.items.length > 0);
      return {
        status: rows.length === 0 ? 'empty' : 'success',
        rowIds: rows.map((row) => row.id),
        rows: Object.fromEntries(
          rows.map((row) => [
            row.id,
            { ...row, items: appendUniquePieces([], row.items), page: 0, status: 'idle' },
          ]),
        ),
      };
    }
    case 'loadFailed':
      return { status: 'error', rowIds: [], rows: {} };
    case 'pageStart':
      return updateRow(state, action.rowId, (row) => ({ ...row, status: 'loadingMore' }));
    case 'pageLoaded':
      return updateRow(state, action.rowId, (row) => ({
        ...row,
        items: appendUniquePieces(row.items, action.items),
        page: action.page,
        hasNext: action.hasNext,
        status: 'idle',
      }));
    case 'pageFailed':
      return updateRow(state, action.rowId, (row) => ({ ...row, status: 'error' }));
  }
}

export function createWardrobeStore(fetchWardrobe: WardrobeFetch) {
  let state = INITIAL_WARDROBE_STATE;
  const listeners = new Set<() => void>();
  // Keyed by row id; the initial load uses INITIAL_KEY.
  const controllers = new Map<string, AbortController>();
  const INITIAL_KEY = '\u0000initial';

  function dispatch(action: WardrobeAction) {
    const next = wardrobeReducer(state, action);
    if (next === state) return;
    state = next;
    listeners.forEach((listener) => listener());
  }

  function abortAll() {
    controllers.forEach((controller) => controller.abort());
    controllers.clear();
  }

  async function run(key: string, request: (signal: AbortSignal) => Promise<void>) {
    const controller = new AbortController();
    controllers.set(key, controller);
    try {
      await request(controller.signal);
    } finally {
      if (controllers.get(key) === controller) controllers.delete(key);
    }
  }

  async function loadInitial() {
    abortAll();
    dispatch({ type: 'load' });
    await run(INITIAL_KEY, async (signal) => {
      try {
        const rows = await fetchWardrobe({ page: 0, signal });
        if (!signal.aborted) dispatch({ type: 'loaded', rows });
      } catch {
        if (!signal.aborted) dispatch({ type: 'loadFailed' });
      }
    });
  }

  async function loadMore(rowId: string, { retry = false } = {}) {
    const row = state.rows[rowId];
    if (
      state.status !== 'success' ||
      !row ||
      !row.hasNext ||
      row.status === 'loadingMore' ||
      controllers.has(rowId) ||
      (row.status === 'error' && !retry)
    ) {
      return;
    }

    const page = row.page + 1;
    dispatch({ type: 'pageStart', rowId });
    await run(rowId, async (signal) => {
      try {
        const rows = await fetchWardrobe({ category: rowId, page, signal });
        if (signal.aborted) return;
        const result = rows.find((candidate) => candidate.id === rowId);
        dispatch({
          type: 'pageLoaded',
          rowId,
          page,
          items: result?.items ?? [],
          hasNext: result?.hasNext ?? false,
        });
      } catch {
        if (!signal.aborted) dispatch({ type: 'pageFailed', rowId });
      }
    });
  }

  return {
    getState: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    loadInitial,
    loadMore,
    retryRow: (rowId: string) => loadMore(rowId, { retry: true }),
    abortAll,
  };
}

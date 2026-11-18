import type { WardrobePiece } from '../types/Look';

import { lookPieceRank } from './look-order';

const ACCENT_MARKS = /[\u0300-\u036f]/g;
const KEEP_PLURAL = new Set(['tenis', 'outros', 'oculos']);

const CANONICAL_TITLES: Record<string, string> = {
  calca: 'Calça',
  calcado: 'Calçado',
  sandalia: 'Sandália',
  tenis: 'Tênis',
  macacao: 'Macacão',
  oculos: 'Óculos',
  outros: 'Outros',
};

function normalizeCategoryKey(raw: string): string {
  const ascii = raw.trim().normalize('NFD').replace(ACCENT_MARKS, '').toLowerCase();
  if (!ascii || ascii === 'outro') return 'outros';
  if (ascii === 'macacoes') return 'macacao';
  if (ascii === 'moletons') return 'moletom';
  if (!KEEP_PLURAL.has(ascii) && ascii.length > 3 && ascii.endsWith('s')) {
    return ascii.slice(0, -1);
  }
  return ascii;
}

export function formatWardrobeCategory(category: string | null | undefined): string {
  const trimmed = category?.trim() ?? '';
  if (!trimmed) return 'Outros';

  const key = normalizeCategoryKey(trimmed);
  if (CANONICAL_TITLES[key]) return CANONICAL_TITLES[key];

  const singular =
    !KEEP_PLURAL.has(key) && trimmed.length > 3 && /[sS]$/.test(trimmed)
      ? trimmed.slice(0, -1)
      : trimmed;

  return singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
}

export function sortWardrobeRows<T extends { title: string }>(rows: T[]): T[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => lookPieceRank(a.row.title) - lookPieceRank(b.row.title) || a.index - b.index)
    .map(({ row }) => row);
}

export type WardrobeRowPage = {
  id: string;
  title: string;
  items: WardrobePiece[];
  hasNext: boolean;
};

export function groupWardrobePieces(pieces: WardrobePiece[]): WardrobeRowPage[] {
  const rows = new Map<string, WardrobeRowPage>();
  for (const piece of pieces) {
    const category = formatWardrobeCategory(piece.category);
    const normalizedPiece = piece.category === category ? piece : { ...piece, category };
    let row = rows.get(category);
    if (!row) {
      row = { id: category, title: category, items: [], hasNext: false };
      rows.set(category, row);
    }
    row.items.push(normalizedPiece);
  }
  return sortWardrobeRows([...rows.values()]);
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
  | { type: 'pageFailed'; rowId: string }
  | { type: 'itemRemoved'; itemId: string };

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
      const merged = new Map<string, WardrobeRow>();
      for (const rawRow of action.rows) {
        if (rawRow.items.length === 0) continue;
        const category = formatWardrobeCategory(rawRow.title || rawRow.id);
        const normalizedItems = rawRow.items.map((item) =>
          item.category === category ? item : { ...item, category },
        );
        const existing = merged.get(category);
        if (existing) {
          existing.items = appendUniquePieces(existing.items, normalizedItems);
          existing.hasNext = existing.hasNext || rawRow.hasNext;
        } else {
          merged.set(category, {
            id: category,
            title: category,
            items: appendUniquePieces([], normalizedItems),
            hasNext: rawRow.hasNext,
            page: 0,
            status: 'idle',
          });
        }
      }
      const rows = sortWardrobeRows([...merged.values()]);
      return {
        status: rows.length === 0 ? 'empty' : 'success',
        rowIds: rows.map((row) => row.id),
        rows: Object.fromEntries(rows.map((row) => [row.id, row])),
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
    case 'itemRemoved': {
      const rowId = state.rowIds.find((id) =>
        state.rows[id].items.some((piece) => piece.id === action.itemId),
      );
      if (rowId === undefined) return state;

      const items = state.rows[rowId].items.filter((piece) => piece.id !== action.itemId);
      if (items.length > 0) return updateRow(state, rowId, (row) => ({ ...row, items }));

      const { [rowId]: _removedRow, ...rows } = state.rows;
      const rowIds = state.rowIds.filter((id) => id !== rowId);
      return { status: rowIds.length === 0 ? 'empty' : state.status, rowIds, rows };
    }
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
    removeItem: (itemId: string) => dispatch({ type: 'itemRemoved', itemId }),
    retryRow: (rowId: string) => loadMore(rowId, { retry: true }),
    abortAll,
  };
}

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { CatalogParams } from '@/api/products';
import { useDebouncedValue } from '@/hooks/UseDebouncedValue';
import type { FilterGroupId } from '@/types/product';

const SEARCH_DEBOUNCE_MS = 300;

type FiltersByGroup = Record<FilterGroupId, Set<string>>;

function createEmptyFilters(): FiltersByGroup {
  return { estilos: new Set(), pecas: new Set(), cores: new Set(), lojas: new Set() };
}

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// Persiste o estado entre unmount/remount causado por navegação de modal na web.
let _cachedSearch = '';
let _cachedAppliedFilters: FiltersByGroup = createEmptyFilters();

export function useStorefrontFilters() {
  const [searchInput, setSearchInput] = useState(_cachedSearch);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchPending = searchInput !== debouncedSearch;

  const [appliedFiltersByGroup, setAppliedFiltersByGroup] = useState<FiltersByGroup>(
    () => _cachedAppliedFilters,
  );
  const [pendingFiltersByGroup, setPendingFiltersByGroup] =
    useState<FiltersByGroup>(createEmptyFilters);

  useEffect(() => {
    _cachedSearch = searchInput;
  }, [searchInput]);
  useEffect(() => {
    _cachedAppliedFilters = appliedFiltersByGroup;
  }, [appliedFiltersByGroup]);

  const openSheetDraft = useCallback(() => {
    setPendingFiltersByGroup({
      estilos: new Set(appliedFiltersByGroup.estilos),
      pecas: new Set(appliedFiltersByGroup.pecas),
      cores: new Set(appliedFiltersByGroup.cores),
      lojas: new Set(appliedFiltersByGroup.lojas),
    });
  }, [appliedFiltersByGroup]);

  const togglePendingFilter = useCallback((groupId: FilterGroupId, optionId: string) => {
    setPendingFiltersByGroup((current) => ({
      ...current,
      [groupId]: toggleInSet(current[groupId], optionId),
    }));
  }, []);

  const toggleAppliedFilter = useCallback((groupId: FilterGroupId, optionId: string) => {
    setAppliedFiltersByGroup((current) => ({
      ...current,
      [groupId]: toggleInSet(current[groupId], optionId),
    }));
  }, []);

  const applyPendingFilters = useCallback(() => {
    setAppliedFiltersByGroup(pendingFiltersByGroup);
  }, [pendingFiltersByGroup]);

  const clearAllFilters = useCallback(() => {
    setPendingFiltersByGroup(createEmptyFilters());
    setAppliedFiltersByGroup(createEmptyFilters());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  const appliedFilterIds = useMemo(
    () =>
      new Set([
        ...appliedFiltersByGroup.estilos,
        ...appliedFiltersByGroup.pecas,
        ...appliedFiltersByGroup.cores,
        ...appliedFiltersByGroup.lojas,
      ]),
    [appliedFiltersByGroup],
  );

  const catalogParams = useMemo(
    (): CatalogParams => ({
      search: debouncedSearch || undefined,
      styles:
        appliedFiltersByGroup.estilos.size > 0 ? [...appliedFiltersByGroup.estilos] : undefined,
      categories:
        appliedFiltersByGroup.pecas.size > 0 ? [...appliedFiltersByGroup.pecas] : undefined,
      colors: appliedFiltersByGroup.cores.size > 0 ? [...appliedFiltersByGroup.cores] : undefined,
      companies:
        appliedFiltersByGroup.lojas.size > 0 ? [...appliedFiltersByGroup.lojas] : undefined,
    }),
    [debouncedSearch, appliedFiltersByGroup],
  );

  return {
    searchInput,
    setSearchInput,
    isSearchPending,
    appliedFiltersByGroup,
    appliedFilterIds,
    pendingFiltersByGroup,
    openSheetDraft,
    togglePendingFilter,
    toggleAppliedFilter,
    applyPendingFilters,
    clearAllFilters,
    clearSearch,
    catalogParams,
  };
}

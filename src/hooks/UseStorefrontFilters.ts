import { useCallback, useMemo, useState } from 'react';

import { useDebouncedValue } from '@/hooks/UseDebouncedValue';
import type { FilterGroupId, Product } from '@/types/product';

const SEARCH_DEBOUNCE_MS = 300;

type FiltersByGroup = Record<FilterGroupId, Set<string>>;

function createEmptyFilters(): FiltersByGroup {
  return { estilos: new Set(), pecas: new Set(), cores: new Set() };
}

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

const PRODUCT_ATTRIBUTE_BY_GROUP: Record<FilterGroupId, (product: Product) => string | undefined> =
  {
    estilos: (product) => product.style,
    pecas: (product) => product.category,
    cores: (product) => product.color?.toLowerCase(),
  };

function matchesFilters(product: Product, filters: FiltersByGroup): boolean {
  return (Object.keys(filters) as FilterGroupId[]).every((groupId) => {
    const selected = filters[groupId];
    if (selected.size === 0) return true;

    const attribute = PRODUCT_ATTRIBUTE_BY_GROUP[groupId](product);
    return attribute != null && selected.has(attribute);
  });
}

function matchesSearch(product: Product, search: string): boolean {
  if (!search) return true;
  const term = search.toLowerCase();
  return (
    product.name.toLowerCase().includes(term) || product.storeName.toLowerCase().includes(term)
  );
}

export function useStorefrontFilters() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchPending = searchInput !== debouncedSearch;

  const [appliedFiltersByGroup, setAppliedFiltersByGroup] =
    useState<FiltersByGroup>(createEmptyFilters);
  const [pendingFiltersByGroup, setPendingFiltersByGroup] =
    useState<FiltersByGroup>(createEmptyFilters);

  const openSheetDraft = useCallback(() => {
    setPendingFiltersByGroup({
      estilos: new Set(appliedFiltersByGroup.estilos),
      pecas: new Set(appliedFiltersByGroup.pecas),
      cores: new Set(appliedFiltersByGroup.cores),
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

  const filterProducts = useCallback(
    (products: Product[]) =>
      products.filter(
        (product) =>
          matchesSearch(product, debouncedSearch) && matchesFilters(product, appliedFiltersByGroup),
      ),
    [debouncedSearch, appliedFiltersByGroup],
  );

  const appliedFilterIds = useMemo(
    () =>
      new Set([
        ...appliedFiltersByGroup.estilos,
        ...appliedFiltersByGroup.pecas,
        ...appliedFiltersByGroup.cores,
      ]),
    [appliedFiltersByGroup],
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
    filterProducts,
  };
}

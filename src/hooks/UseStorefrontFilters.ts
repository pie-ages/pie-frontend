import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@/hooks/UseDebouncedValue';
import { PROFILE_COLORIMETRY, PROFILE_MATCHES, type FilterGroupId } from '@/types/Filter';
import type { CatalogParams } from '@/types/Product';

const SEARCH_DEBOUNCE_MS = 300;

type FiltersByGroup = Record<FilterGroupId, Set<string>>;

function createEmptyFilters(): FiltersByGroup {
  return {
    estilos: new Set(),
    pecas: new Set(),
    cores: new Set(),
    materiais: new Set(),
    lojas: new Set(),
    generos: new Set(),
    perfil: new Set(),
  };
}

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

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
      materiais: new Set(appliedFiltersByGroup.materiais),
      generos: new Set(appliedFiltersByGroup.generos),
      perfil: new Set(appliedFiltersByGroup.perfil),
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
        ...appliedFiltersByGroup.materiais,
        ...appliedFiltersByGroup.generos,
        ...appliedFiltersByGroup.perfil,
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
      materials:
        appliedFiltersByGroup.materiais.size > 0 ? [...appliedFiltersByGroup.materiais] : undefined,
      genders:
        appliedFiltersByGroup.generos.size > 0 ? [...appliedFiltersByGroup.generos] : undefined,
      colorimetry: appliedFiltersByGroup.perfil.has(PROFILE_COLORIMETRY) || undefined,
      matchesProfile: appliedFiltersByGroup.perfil.has(PROFILE_MATCHES) || undefined,
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

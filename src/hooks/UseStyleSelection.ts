import { useCallback, useMemo, useState } from 'react';

import { useTaxonomy } from '@/hooks/UseTaxonomy';
import type { FilterOption } from '@/types/Filter';

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function useStyleSelection() {
  const { filterGroups, isLoading } = useTaxonomy();
  const styleOptions: FilterOption[] = useMemo(
    () => filterGroups.find((group) => group.id === 'estilos')?.options ?? [],
    [filterGroups],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);

  // ponytail: estilo(s) atual(is) mockado(s) — o usuário pode ter mais de um
  // estilo associado ao perfil, até a integração trazer o valor real via
  // GET /users/me/style. Só usamos o mock enquanto o usuário não mexeu em nada.
  const displayedIds = useMemo(
    () => (!hasInteracted && styleOptions.length > 0 ? new Set([styleOptions[0].id]) : selectedIds),
    [hasInteracted, styleOptions, selectedIds],
  );

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds(toggleInSet(displayedIds, id));
      setHasInteracted(true);
    },
    [displayedIds],
  );

  const confirm = useCallback(() => {
    // esperando o auth
  }, []);

  return {
    styleOptions,
    isLoading,
    selectedIds: displayedIds,
    toggle,
    confirm,
  };
}

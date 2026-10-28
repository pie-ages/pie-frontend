import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getFavoriteStyles, StyleSessionError, updateFavoriteStyles } from '@/services/style';
import { IDENTIFIED_STYLE_INFO, IDENTIFIED_STYLES } from '@/types/IdentifiedStyle';

const LOAD_ERROR = 'Não foi possível carregar seus estilos.';
const SAVE_ERROR = 'Não foi possível salvar seus estilos. Tente novamente.';

export function useEditFavoriteStyles() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styleOptions = useMemo(
    () => IDENTIFIED_STYLES.map((id) => ({ id, label: IDENTIFIED_STYLE_INFO[id].label })),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    getFavoriteStyles(controller.signal)
      .then((styles) => {
        if (!controller.signal.aborted) setSelected(new Set(styles));
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return;
        if (loadError instanceof StyleSessionError) setSessionExpired(true);
        else setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const canSave = !isLoading && !isSaving && selected.size > 0;

  const save = useCallback(async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateFavoriteStyles(IDENTIFIED_STYLES.filter((id) => selected.has(id)));
      router.back();
    } catch (saveError) {
      if (saveError instanceof StyleSessionError) setSessionExpired(true);
      else setError(SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  }, [canSave, selected]);

  return {
    styleOptions,
    selectedIds: selected,
    toggle,
    isLoading,
    isSaving,
    canSave,
    error,
    sessionExpired,
    save,
  };
}

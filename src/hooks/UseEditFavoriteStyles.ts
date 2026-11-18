import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getFavoriteStyles, StyleSessionError, updateFavoriteStyles } from '@/services/style';
import {
  IDENTIFIED_STYLE_INFO,
  PERSONAL_STYLES,
  isPersonalStyle,
  type PersonalStyle,
  type IdentifiedStyle,
} from '@/types/IdentifiedStyle';

const LOAD_ERROR = 'Não foi possível carregar seus estilos.';
const SAVE_ERROR = 'Não foi possível salvar seus estilos. Tente novamente.';

export function useEditFavoriteStyles(onContinue?: () => void) {
  const [selected, setSelected] = useState<Set<PersonalStyle>>(new Set());
  const [initialStyles, setInitialStyles] = useState<Set<IdentifiedStyle> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  const styleOptions = useMemo(
    () => PERSONAL_STYLES.map((id) => ({ id, label: IDENTIFIED_STYLE_INFO[id].label })),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    getFavoriteStyles(controller.signal)
      .then((styles) => {
        if (controller.signal.aborted) return;
        const savedStyles = new Set(styles);
        setInitialStyles(savedStyles);
        setSelected(new Set([...savedStyles].filter(isPersonalStyle)));
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
  }, [loadAttempt]);

  const retryLoad = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const toggle = useCallback((id: string) => {
    if (!isPersonalStyle(id)) return;
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const canSave = initialStyles !== null && !isLoading && !isSaving && selected.size > 0;

  const save = useCallback(async () => {
    if (!canSave || !initialStyles) return;
    if (
      selected.size === initialStyles.size &&
      [...selected].every((id) => initialStyles.has(id))
    ) {
      if (onContinue) onContinue();
      else router.back();
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const savedStyles = await updateFavoriteStyles(
        PERSONAL_STYLES.filter((id) => selected.has(id)),
      );
      if (onContinue) {
        const saved = new Set(savedStyles);
        setInitialStyles(saved);
        setSelected(new Set([...saved].filter(isPersonalStyle)));
        onContinue();
      } else {
        router.dismissTo({ pathname: '/(screens)/Profile', params: { updatedSection: 'styles' } });
      }
    } catch (saveError) {
      if (saveError instanceof StyleSessionError) setSessionExpired(true);
      else setError(SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  }, [canSave, initialStyles, onContinue, selected]);

  return {
    styleOptions,
    selectedIds: selected,
    toggle,
    isLoading,
    isSaving,
    canSave,
    hasLoadError: !isLoading && initialStyles === null && !sessionExpired,
    retryLoad,
    error,
    sessionExpired,
    save,
  };
}

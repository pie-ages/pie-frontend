import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUserStyle } from '@/contexts/UserStyleContext';
import { fetchUserProductStyles, updateUserProductStyles } from '@/services/profile';
import { STYLE_LABELS, STYLES } from '@/types/Style';

export function useStyleSelection() {
  const { styles: currentStyles, setStyles } = useUserStyle();
  const [selected, setSelected] = useState<Set<string>>(new Set(currentStyles));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styleOptions = useMemo(() => STYLES.map((id) => ({ id, label: STYLE_LABELS[id] })), []);

  useEffect(() => {
    let isActive = true;

    fetchUserProductStyles()
      .then((styles) => {
        if (!isActive) return;
        setStyles(styles);
        setSelected(new Set(styles));
      })
      .catch(() => {
        if (isActive) setError('Não foi possível carregar seus estilos.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [setStyles]);

  const toggle = useCallback((id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const confirm = useCallback(async () => {
    if (isSaving || isLoading) return;
    setIsSaving(true);
    setError(null);
    try {
      const updatedStyles = await updateUserProductStyles(STYLES.filter((id) => selected.has(id)));
      setStyles(updatedStyles);
      router.replace('/ColorimetryResult');
    } catch {
      setError('Não foi possível salvar seus estilos. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }, [isLoading, isSaving, selected, setStyles]);

  return {
    styleOptions,
    selectedIds: selected,
    toggle,
    confirm,
    isLoading,
    isSaving,
    error,
  };
}

import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { useUserStyle } from '@/hooks/UseUserStyle';
import { STYLE_LABELS, STYLES } from '@/types/Style';

export function useStyleSelection() {
  const { styles: currentStyles, setStyles } = useUserStyle();
  const [selected, setSelected] = useState<Set<string>>(new Set(currentStyles));

  const styleOptions = useMemo(() => STYLES.map((id) => ({ id, label: STYLE_LABELS[id] })), []);

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

  const confirm = useCallback(() => {
    setStyles(STYLES.filter((id) => selected.has(id)));
    router.replace('/screens/ColorimetryResult');
  }, [selected, setStyles]);

  return {
    styleOptions,
    selectedIds: selected,
    toggle,
    confirm,
  };
}

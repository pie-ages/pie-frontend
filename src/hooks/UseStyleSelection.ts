import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { useUserStyle } from '@/hooks/UseUserStyle';
import { STYLE_LABELS, STYLES, Style } from '@/types/Style';

export function useStyleSelection() {
  const { style: currentStyle, setStyle } = useUserStyle();
  const [selected, setSelected] = useState<Style>(currentStyle);

  const styleOptions = useMemo(() => STYLES.map((id) => ({ id, label: STYLE_LABELS[id] })), []);

  const toggle = useCallback((id: string) => {
    setSelected(id as Style);
  }, []);

  const confirm = useCallback(() => {
    setStyle(selected);
    router.back();
  }, [selected, setStyle]);

  return {
    styleOptions,
    selectedIds: new Set([selected]),
    toggle,
    confirm,
  };
}

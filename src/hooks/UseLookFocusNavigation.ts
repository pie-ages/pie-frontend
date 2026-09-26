import { useCallback, useState } from 'react';

import type { Look } from '@/types/look';

export function useLookFocusNavigation(looks: Look[], initialLookId?: string) {
  const [activeLookId, setActiveLookId] = useState(initialLookId);

  const foundIndex = looks.findIndex((look) => look.id === activeLookId);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const activeLook = looks[activeIndex] ?? null;

  const goTo = useCallback(
    (index: number) => {
      const look = looks[index];
      if (look) setActiveLookId(look.id);
    },
    [looks],
  );

  return {
    activeIndex,
    activeLook,
    hasPrevious: activeIndex > 0,
    hasNext: activeIndex < looks.length - 1,
    goTo,
    goPrevious: () => goTo(activeIndex - 1),
    goNext: () => goTo(activeIndex + 1),
  };
}

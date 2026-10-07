import { useCallback, useState } from 'react';

import type { Look } from '@/types/Look';

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
    goTo,
  };
}

import { createContext, ReactNode, useContext, useState } from 'react';

import { MOCK_USER_STYLE } from '@/mocks/style';
import { resolveStyle, Style } from '@/types/Style';

type UserStyleContextValue = {
  style: Style;
  setStyle: (style: Style) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<Style>(resolveStyle(MOCK_USER_STYLE.styles));

  return (
    <UserStyleContext.Provider value={{ style, setStyle }}>{children}</UserStyleContext.Provider>
  );
}

export function useUserStyle() {
  const context = useContext(UserStyleContext);
  if (!context) {
    throw new Error('useUserStyle must be used within UserStyleProvider');
  }
  return context;
}

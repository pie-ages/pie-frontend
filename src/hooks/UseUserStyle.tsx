import { createContext, ReactNode, useContext, useState } from 'react';

import { MOCK_USER_STYLE } from '@/mocks/style';
import { resolveStyles, Style } from '@/types/Style';

type UserStyleContextValue = {
  styles: Style[];
  setStyles: (styles: Style[]) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Style[]>(resolveStyles(MOCK_USER_STYLE.styles));

  return (
    <UserStyleContext.Provider value={{ styles, setStyles }}>{children}</UserStyleContext.Provider>
  );
}

export function useUserStyle() {
  const context = useContext(UserStyleContext);
  if (!context) {
    throw new Error('useUserStyle must be used within UserStyleProvider');
  }
  return context;
}

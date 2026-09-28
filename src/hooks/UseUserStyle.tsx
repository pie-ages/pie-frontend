import { createContext, ReactNode, useContext, useState } from 'react';

import type { IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { Style } from '@/types/Style';

type UserStyleContextValue = {
  styles: Style[];
  setStyles: (styles: Style[]) => void;
  identifiedStyle: IdentifiedStyle | null;
  setIdentifiedStyle: (style: IdentifiedStyle) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [identifiedStyle, setIdentifiedStyle] = useState<IdentifiedStyle | null>(null);

  return (
    <UserStyleContext.Provider value={{ styles, setStyles, identifiedStyle, setIdentifiedStyle }}>
      {children}
    </UserStyleContext.Provider>
  );
}

export function useUserStyle() {
  const context = useContext(UserStyleContext);
  if (!context) {
    throw new Error('useUserStyle must be used within UserStyleProvider');
  }
  return context;
}

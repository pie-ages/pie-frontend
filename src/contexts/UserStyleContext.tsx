import { createContext, ReactNode, useContext, useState } from 'react';

import type { IdentifiedStyle } from '@/types/IdentifiedStyle';
import type { Style } from '@/types/Style';

type UserStyleContextValue = {
  styles: Style[];
  setStyles: (styles: Style[]) => void;
  identifiedStyle: IdentifiedStyle | null;
  setIdentifiedStyle: (style: IdentifiedStyle | null) => void;
  identifiedTouches: IdentifiedStyle[];
  setIdentifiedTouches: (styles: IdentifiedStyle[]) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [identifiedStyle, setIdentifiedStyle] = useState<IdentifiedStyle | null>(null);

  const [identifiedTouches, setIdentifiedTouches] = useState<IdentifiedStyle[]>([]);

  return (
    <UserStyleContext.Provider
      value={{
        styles,
        setStyles,
        identifiedStyle,
        setIdentifiedStyle,
        identifiedTouches,
        setIdentifiedTouches,
      }}
    >
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

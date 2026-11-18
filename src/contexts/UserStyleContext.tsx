import { createContext, ReactNode, useContext, useState } from 'react';

import type { QuizStyle } from '@/types/IdentifiedStyle';
import type { Style } from '@/types/Style';

type UserStyleContextValue = {
  styles: Style[];
  setStyles: (styles: Style[]) => void;
  identifiedStyle: QuizStyle | null;
  setIdentifiedStyle: (style: QuizStyle | null) => void;
  identifiedTouches: QuizStyle[];
  setIdentifiedTouches: (styles: QuizStyle[]) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [identifiedStyle, setIdentifiedStyle] = useState<QuizStyle | null>(null);

  const [identifiedTouches, setIdentifiedTouches] = useState<QuizStyle[]>([]);

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

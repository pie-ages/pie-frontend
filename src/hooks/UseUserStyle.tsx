import { createContext, ReactNode, useContext, useState } from 'react';

import { Style } from '@/types/Style';

type UserStyleContextValue = {
  styles: Style[];
  setStyles: (styles: Style[]) => void;
};

const UserStyleContext = createContext<UserStyleContextValue | null>(null);

export function UserStyleProvider({ children }: { children: ReactNode }) {
  const [styles, setStyles] = useState<Style[]>([]);

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

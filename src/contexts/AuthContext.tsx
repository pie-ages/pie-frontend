import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { getStoredToken, removeStoredToken, storeToken } from '@/utils/auth-storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isActive = true;

    getStoredToken()
      .then((storedToken) => {
        if (isActive) setToken(storedToken);
      })
      .catch(() => removeStoredToken())
      .finally(() => {
        if (isActive) setIsInitializing(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function signIn(newToken: string) {
    await storeToken(newToken);
    setToken(newToken);
  }

  async function signOut() {
    await removeStoredToken();
    setToken(null);
  }

  const value: AuthContextValue = {
    isAuthenticated: token !== null,
    isInitializing,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

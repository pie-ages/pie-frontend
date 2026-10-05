import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { ApiError, apiPost } from '@/services/client';
import type { LoginPayload, LoginResponse } from '@/types/Auth';
import { getStoredToken, removeStoredToken, storeToken } from '@/utils/auth-storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  pendingStyleQuiz: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  completeMockSignUp: (payload: LoginPayload) => Promise<void>;
  completeStyleQuiz: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingStyleQuiz, setPendingStyleQuiz] = useState(false);

  useEffect(() => {
    let isActive = true;

    getStoredToken()
      .then(async (storedToken) => {
        if (storedToken?.startsWith('mock-signup-')) {
          await removeStoredToken();
        }
        if (isActive) setToken(storedToken?.startsWith('mock-signup-') ? null : storedToken);
      })
      .catch(() => {
        if (isActive) setToken(null);
      })
      .finally(() => {
        if (isActive) setIsInitializing(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function signIn(payload: LoginPayload) {
    const data = await apiPost<LoginResponse>('/api/auth/login', payload).catch((error) => {
      if (error instanceof ApiError && !error.serverMessage) {
        throw new ApiError('Não foi possível entrar.', error.status);
      }
      throw error;
    });

    if (!data?.token || !data.user) {
      throw new ApiError('A API retornou uma resposta de autenticação inválida.', 200);
    }

    await storeToken(data.token);
    setToken(data.token);
  }

  async function completeMockSignUp(payload: LoginPayload) {
    await signIn(payload);
    setPendingStyleQuiz(true);
  }

  async function signOut() {
    await removeStoredToken();
    setPendingStyleQuiz(false);
    setToken(null);
  }

  function completeStyleQuiz() {
    setPendingStyleQuiz(false);
  }

  const value: AuthContextValue = {
    isAuthenticated: token !== null,
    isInitializing,
    pendingStyleQuiz,
    signIn,
    completeMockSignUp,
    completeStyleQuiz,
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

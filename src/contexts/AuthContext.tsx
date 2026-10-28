import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { loginResponseSchema, type LoginFormData, type LoginResponse } from '@/schemas/authSchema';
import { ApiError, apiPost, apiPostAuth } from '@/services/client';
import {
  clearSession,
  getStoredExpiresAt,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUserId,
  storeSession,
  storeUserId,
} from '@/utils/auth-storage';

type SessionUser = NonNullable<LoginResponse['user']>;

type AuthContextValue = {
  user: SessionUser | null;
  userId: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  pendingStyleQuiz: boolean;
  signIn: (payload: LoginFormData) => Promise<void>;
  completeSignUp: (payload: LoginFormData) => Promise<void>;
  completeStyleQuiz: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingStyleQuiz, setPendingStyleQuiz] = useState(false);

  async function tryRefresh(): Promise<{ token: string; user: SessionUser | null } | null> {
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await apiPost('/api/auth/refresh', { refreshToken });
      const result = loginResponseSchema.safeParse(response);
      if (!result.success) return null;

      const data = result.data;
      await storeSession(data.accessToken, data.refreshToken, data.expiresIn);
      if (data.user) await storeUserId(data.user.id);
      return { token: data.accessToken, user: data.user ?? null };
    } catch {
      await clearSession();
      return null;
    }
  }

  useEffect(() => {
    let isActive = true;

    async function init() {
      try {
        const storedToken = await getStoredToken();
        if (!storedToken) return;

        const expiresAt = await getStoredExpiresAt();
        const isExpired = expiresAt !== null && Date.now() >= expiresAt - 30_000;

        if (isExpired) {
          const refreshed = await tryRefresh();
          if (isActive) {
            setToken(refreshed?.token ?? null);
            setUser(refreshed?.user ?? null);
            setUserId(refreshed ? (refreshed.user?.id ?? (await getStoredUserId())) : null);
          }
          return;
        }

        const storedUserId = await getStoredUserId();
        if (isActive) {
          setToken(storedToken);
          setUserId(storedUserId ?? null);
        }
      } catch {
        if (isActive) setToken(null);
      } finally {
        if (isActive) setIsInitializing(false);
      }
    }

    init();

    return () => {
      isActive = false;
    };
  }, []);

  async function signIn(payload: LoginFormData) {
    const response = await apiPost('/api/auth/login', payload).catch((error) => {
      if (error instanceof ApiError && !error.serverMessage) {
        throw new ApiError('Não foi possível entrar.', error.status);
      }
      throw error;
    });

    const result = loginResponseSchema.safeParse(response);
    if (!result.success) {
      throw new ApiError('A API retornou uma resposta de autenticação inválida.', 200);
    }

    const data = result.data;
    await storeSession(data.accessToken, data.refreshToken, data.expiresIn);
    await storeUserId(data.user?.id ?? null);
    setToken(data.accessToken);
    setUser(data.user ?? null);
    setUserId(data.user?.id ?? null);
  }

  async function completeSignUp(payload: LoginFormData) {
    await signIn(payload);
    setPendingStyleQuiz(true);
  }

  async function signOut() {
    const currentToken = token;
    setToken(null);
    setUser(null);
    setUserId(null);
    setPendingStyleQuiz(false);

    if (currentToken) {
      apiPostAuth('/api/auth/logout').catch(() => {});
    }

    await clearSession();
  }

  function completeStyleQuiz() {
    setPendingStyleQuiz(false);
  }

  const value: AuthContextValue = {
    user,
    userId,
    isAuthenticated: token !== null,
    isInitializing,
    pendingStyleQuiz,
    signIn,
    completeSignUp,
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

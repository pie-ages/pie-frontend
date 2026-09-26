import axios, { isAxiosError } from 'axios';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import type { LoginPayload, LoginResponse } from '@/shared/Login';
import { getStoredToken, removeStoredToken, storeToken } from '@/utils/auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

type ErrorResponse = { message?: string };

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

type AuthContextValue = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
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
    let response;
    try {
      response = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, payload);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new AuthApiError(
          error.response?.data?.message ?? 'Não foi possível entrar.',
          error.response?.status ?? 500,
        );
      }
      throw error;
    }

    if (!response.data?.token || !response.data.user) {
      throw new AuthApiError(
        'A API retornou uma resposta de autenticação inválida.',
        response.status,
      );
    }

    await storeToken(response.data.token);
    setToken(response.data.token);
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

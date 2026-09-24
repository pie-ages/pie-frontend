import { useRef, useState } from 'react';

import { AuthApiError, login } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginPayload } from '@/shared/Login';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  async function handleLogin() {
    if (requestInProgress.current) return;

    setError(null);

    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }

    const payload: LoginPayload = {
      email: email.trim(),
      password,
    };

    requestInProgress.current = true;
    setIsLoading(true);

    try {
      const response = await login(payload);
      await signIn(response.token);
    } catch (loginError) {
      setError(
        loginError instanceof AuthApiError
          ? loginError.message
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }

  return {
    email,
    password,
    isPasswordVisible,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
  };
}

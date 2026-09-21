import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { LoginPayload } from '@/shared/Login';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  async function handleLogin() {
    setError(null);

    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }

    const _payload: LoginPayload = {
      email: email.trim(),
      password,
    };

    setIsLoading(true);

    try {
      // A autenticação real será integrada à API futuramente, agora é apenas simulação com o payload pronto
      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    signIn();
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

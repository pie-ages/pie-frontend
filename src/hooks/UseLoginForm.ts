import { useRouter } from 'expo-router';
import { useState } from 'react';

import type { LoginPayload } from '@/types/Login';

export function useLoginForm() {
  const router = useRouter();
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

    const payload: LoginPayload = {
      email: email.trim(),
      password,
    };

    setIsLoading(true);

    try {
      // A autenticação real será integrada à API futuramente, agora é apenas simulação com o payload pronto
      console.log('Login payload:', payload);

      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }

    router.push('/screens/Storefront');
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

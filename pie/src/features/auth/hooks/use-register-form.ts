import { useState } from 'react';

import type { RegisterPayload } from '@/features/auth/types/register';

// simua temporariamente a chamada que futuramente será realizada pela API
async function simulateRegisterRequest(_payload: RegisterPayload) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

export function useRegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((previousValue) => !previousValue);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((previousValue) => !previousValue);
  };

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError('Por favor, insira um e-mail válido.');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleRegister = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      const payload: RegisterPayload = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      // Futuramente:
      // await api.post('/users', payload);
      await simulateRegisterRequest(payload);

      return true;
    } catch {
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRegister,
  };
}

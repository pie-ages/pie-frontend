import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/schemas/authSchema';
import { ApiError } from '@/services/client';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  const handleLogin = handleSubmit(async (data) => {
    setError(null);

    try {
      await signIn(data);
    } catch (loginError) {
      setError(
        loginError instanceof ApiError
          ? loginError.message
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
    }
  });

  return {
    control,
    errors,
    isPasswordVisible,
    isLoading: isSubmitting,
    error,
    togglePasswordVisibility,
    handleLogin,
  };
}

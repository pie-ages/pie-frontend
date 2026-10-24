import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';
import { ApiError } from '@/services/client';
import { createUser } from '@/services/users';

export function useRegisterForm() {
  const { completeSignUp } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((previousValue) => !previousValue);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((previousValue) => !previousValue);
  };

  const handleRegister = handleSubmit(async ({ name, email, password }) => {
    setError(null);

    try {
      await createUser({ name, email, password });
    } catch (createError) {
      setError(
        createError instanceof ApiError && createError.serverMessage
          ? createError.serverMessage
          : 'Ocorreu um erro ao criar a conta. Tente novamente.',
      );
      return;
    }

    try {
      await completeSignUp({ email, password });
    } catch (registerError) {
      setError(
        registerError instanceof ApiError
          ? registerError.message
          : 'Conta criada, mas não foi possível iniciar sua sessão. Faça login para continuar.',
      );
    }
  });

  return {
    control,
    errors,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading: isSubmitting,
    error,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRegister,
  };
}

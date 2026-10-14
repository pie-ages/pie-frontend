import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';
import { ApiError } from '@/services/client';

async function simulateRegisterRequest(_payload: Omit<RegisterFormData, 'confirmPassword'>) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

export function useRegisterForm() {
  const { completeMockSignUp } = useAuth();
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
      await simulateRegisterRequest({ name, email, password });
    } catch {
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
      return;
    }

    try {
      await completeMockSignUp({ email, password });
    } catch (registerError) {
      setError(
        registerError instanceof ApiError
          ? registerError.message
          : 'Não foi possível iniciar sua sessão. Tente novamente.',
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

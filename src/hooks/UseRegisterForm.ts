import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';
import { ApiError } from '@/services/client';
import { registerUser } from '@/services/user';

const REGISTER_ERROR_MESSAGE = 'Ocorreu um erro ao criar a conta. Tente novamente.';

function getRegisterErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return REGISTER_ERROR_MESSAGE;
  if (error.status === 409) return 'Este e-mail já está cadastrado.';
  return error.serverMessage ?? REGISTER_ERROR_MESSAGE;
}

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
      await registerUser({ name, email, password });
    } catch (registerError) {
      setError(getRegisterErrorMessage(registerError));
      return;
    }

    try {
      await completeSignUp({ email, password });
    } catch (signInError) {
      setError(
        signInError instanceof ApiError
          ? signInError.message
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

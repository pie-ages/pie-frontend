import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/authSchema';
import { revokeRecoverySession, updatePassword } from '@/services/auth';
import { ApiError } from '@/services/client';

function getResetErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Não foi possível conectar. Verifique sua conexão e tente novamente.';
  }
  if (error.status === 401) {
    return 'Seu código expirou. Volte e solicite um novo código.';
  }
  return error.serverMessage ?? 'Não foi possível redefinir a senha. Tente novamente.';
}

export function useResetPasswordForm(recoveryToken: string) {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  function toggleConfirmPasswordVisibility() {
    setIsConfirmPasswordVisible((currentValue) => !currentValue);
  }

  const handleReset = handleSubmit(async ({ password }) => {
    setError(null);

    try {
      await updatePassword(recoveryToken, password);
    } catch (resetError) {
      setError(getResetErrorMessage(resetError));
      return;
    }

    revokeRecoverySession(recoveryToken).catch(() => {});
    router.dismissTo('/Login');
    Alert.alert('Senha redefinida!', 'Entre com a sua nova senha para acessar sua conta.');
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
    handleReset,
  };
}

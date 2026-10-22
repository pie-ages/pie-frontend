import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/authSchema';
import { resetPassword } from '@/services/auth';
import { ApiError } from '@/services/client';

export function useResetPasswordForm() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();
  const { token_hash: tokenHash } = useLocalSearchParams<{ token_hash?: string }>();
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
    if (!tokenHash) return;

    setError(null);

    try {
      await resetPassword(tokenHash, password);
    } catch (resetError) {
      setError(
        resetError instanceof ApiError
          ? (resetError.serverMessage ?? 'Não foi possível redefinir a senha. Tente novamente.')
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
      return;
    }

    if (isAuthenticated) {
      await signOut();
    }

    router.dismissTo('/Login');
    Alert.alert('Senha redefinida!', 'Entre com a sua nova senha para acessar sua conta.');
  });

  return {
    control,
    errors,
    hasToken: Boolean(tokenHash),
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading: isSubmitting,
    error,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleReset,
  };
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/authSchema';
import { requestPasswordRecovery } from '@/services/auth';
import { ApiError } from '@/services/client';

export function useForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleRecovery = handleSubmit(async ({ email }) => {
    setError(null);

    try {
      await requestPasswordRecovery(email);
    } catch (recoveryError) {
      setError(
        recoveryError instanceof ApiError
          ? (recoveryError.serverMessage ?? 'Não foi possível enviar o código. Tente novamente.')
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
      return;
    }

    router.push({ pathname: '/ResetPassword', params: { email } });
  });

  return {
    control,
    emailError: errors.email?.message,
    isLoading: isSubmitting,
    error,
    handleRecovery,
  };
}

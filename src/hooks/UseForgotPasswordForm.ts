import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/authSchema';
import { requestPasswordRecovery } from '@/services/auth';
import { ApiError } from '@/services/client';

export function useForgotPasswordForm() {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleRecovery = handleSubmit(async ({ email }) => {
    setEmailError(null);
    setError(null);
    setSentTo(null);

    try {
      await requestPasswordRecovery(email);
      setSentTo(email);
    } catch (recoveryError) {
      if (recoveryError instanceof ApiError && recoveryError.status === 404) {
        setEmailError('Não encontramos uma conta vinculada a este e-mail.');
        return;
      }

      setError(
        recoveryError instanceof ApiError
          ? recoveryError.message
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
    }
  });

  return {
    control,
    emailError: errors.email?.message ?? emailError ?? undefined,
    isLoading: isSubmitting,
    error,
    sentTo,
    handleRecovery,
  };
}

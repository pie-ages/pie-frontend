import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/authSchema';
import { requestPasswordRecovery } from '@/services/auth';
import { ApiError } from '@/services/client';

export function useForgotPasswordForm() {
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
    setError(null);
    setSentTo(null);

    try {
      await requestPasswordRecovery(email);
      setSentTo(email);
    } catch (recoveryError) {
      setError(
        recoveryError instanceof ApiError
          ? recoveryError.message
          : 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      );
    }
  });

  return {
    control,
    emailError: errors.email?.message,
    isLoading: isSubmitting,
    error,
    sentTo,
    handleRecovery,
  };
}

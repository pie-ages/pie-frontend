import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { recoveryCodeSchema, type RecoveryCodeFormData } from '@/schemas/authSchema';
import { requestPasswordRecovery, verifyRecoveryCode } from '@/services/auth';
import { ApiError } from '@/services/client';

const CONNECTION_ERROR = 'Não foi possível conectar. Verifique sua conexão e tente novamente.';

export function useRecoveryCodeForm(email: string, onVerified: (recoveryToken: string) => void) {
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryCodeFormData>({
    resolver: zodResolver(recoveryCodeSchema),
    defaultValues: { code: '' },
  });

  const handleVerify = handleSubmit(async ({ code }) => {
    setError(null);
    setHasResent(false);

    let recoveryToken: string;
    try {
      recoveryToken = await verifyRecoveryCode(email, code);
    } catch (verifyError) {
      setError(
        verifyError instanceof ApiError
          ? (verifyError.serverMessage ?? 'Não foi possível verificar o código. Tente novamente.')
          : CONNECTION_ERROR,
      );
      return;
    }

    onVerified(recoveryToken);
  });

  async function handleResend() {
    setError(null);
    setHasResent(false);
    setIsResending(true);

    try {
      await requestPasswordRecovery(email);
      reset();
      setHasResent(true);
    } catch (resendError) {
      setError(
        resendError instanceof ApiError
          ? (resendError.serverMessage ?? 'Não foi possível reenviar o código. Tente novamente.')
          : CONNECTION_ERROR,
      );
    } finally {
      setIsResending(false);
    }
  }

  return {
    control,
    codeError: errors.code?.message,
    isLoading: isSubmitting,
    isResending,
    error,
    hasResent,
    handleVerify,
    handleResend,
  };
}

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useController } from 'react-hook-form';

import { useForgotPasswordForm } from '@/hooks/UseForgotPasswordForm';
import { requestPasswordRecovery } from '@/services/auth';
import { ApiError } from '@/services/client';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('@/services/auth');

const mockRequestPasswordRecovery = jest.mocked(requestPasswordRecovery);

function renderForm() {
  return renderHook(() => {
    const form = useForgotPasswordForm();
    const email = useController({ control: form.control, name: 'email' });
    return { form, email };
  });
}

describe('useForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPasswordRecovery.mockResolvedValue(undefined);
  });

  it('envia o código e abre a verificação com o e-mail informado', async () => {
    const { result } = await renderForm();

    await act(async () => result.current.email.field.onChange(' anna@pie.com.br '));
    await act(async () => result.current.form.handleRecovery());

    expect(mockRequestPasswordRecovery).toHaveBeenCalledWith('anna@pie.com.br');
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/ResetPassword',
      params: { email: 'anna@pie.com.br' },
    });
  });

  it('mostra a mensagem do servidor e não avança quando o envio falha', async () => {
    mockRequestPasswordRecovery.mockRejectedValue(
      new ApiError('Muitas tentativas', 429, 'Aguarde um pouco antes de pedir um novo código'),
    );
    const { result } = await renderForm();

    await act(async () => result.current.email.field.onChange('anna@pie.com.br'));
    await act(async () => result.current.form.handleRecovery());

    expect(result.current.form.error).toBe('Aguarde um pouco antes de pedir um novo código');
    expect(mockPush).not.toHaveBeenCalled();
  });
});

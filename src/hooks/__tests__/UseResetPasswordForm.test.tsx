import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useController } from 'react-hook-form';
import { Alert } from 'react-native';

import { useResetPasswordForm } from '@/hooks/UseResetPasswordForm';
import { revokeRecoverySession, updatePassword } from '@/services/auth';
import { ApiError } from '@/services/client';

const mockDismissTo = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ dismissTo: mockDismissTo }) }));
jest.mock('@/services/auth');

const mockUpdatePassword = jest.mocked(updatePassword);
const mockRevokeRecoverySession = jest.mocked(revokeRecoverySession);

function renderForm() {
  return renderHook(() => {
    const form = useResetPasswordForm('recovery-token');
    const password = useController({ control: form.control, name: 'password' });
    const confirmPassword = useController({ control: form.control, name: 'confirmPassword' });
    return { form, password, confirmPassword };
  });
}

async function submitPassword(
  result: Awaited<ReturnType<typeof renderForm>>['result'],
  password: string,
) {
  await act(async () => result.current.password.field.onChange(password));
  await act(async () => result.current.confirmPassword.field.onChange(password));
  await act(async () => result.current.form.handleReset());
}

describe('useResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockUpdatePassword.mockResolvedValue(undefined);
    mockRevokeRecoverySession.mockResolvedValue(undefined);
  });

  it('troca a senha, encerra a sessão de recuperação e volta para o login', async () => {
    const { result } = await renderForm();

    await submitPassword(result, 'novaSenha123');

    expect(mockUpdatePassword).toHaveBeenCalledWith('recovery-token', 'novaSenha123');
    expect(mockRevokeRecoverySession).toHaveBeenCalledWith('recovery-token');
    expect(mockDismissTo).toHaveBeenCalledWith('/Login');
    expect(Alert.alert).toHaveBeenCalledWith(
      'Senha redefinida!',
      'Entre com a sua nova senha para acessar sua conta.',
    );
  });

  it('mostra a mensagem do servidor quando a senha é recusada', async () => {
    mockUpdatePassword.mockRejectedValue(
      new ApiError('Senha igual', 400, 'A nova senha deve ser diferente da atual'),
    );
    const { result } = await renderForm();

    await submitPassword(result, 'novaSenha123');

    expect(result.current.form.error).toBe('A nova senha deve ser diferente da atual');
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('pede um novo código quando a sessão de recuperação expirou', async () => {
    mockUpdatePassword.mockRejectedValue(new ApiError('Não autorizado', 401));
    const { result } = await renderForm();

    await submitPassword(result, 'novaSenha123');

    expect(result.current.form.error).toBe('Seu código expirou. Volte e solicite um novo código.');
    expect(mockRevokeRecoverySession).not.toHaveBeenCalled();
  });
});

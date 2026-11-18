import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useController } from 'react-hook-form';

import { useRegisterForm } from '@/hooks/UseRegisterForm';
import { ApiError } from '@/services/client';
import { createUser } from '@/services/users';

const mockCompleteSignUp =
  jest.fn<(payload: { email: string; password: string }) => Promise<void>>();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ completeSignUp: mockCompleteSignUp }),
}));

jest.mock('@/services/users');

const mockCreateUser = jest.mocked(createUser);

function useRegistrationHarness() {
  const form = useRegisterForm();
  const name = useController({ control: form.control, name: 'name' });
  const email = useController({ control: form.control, name: 'email' });
  const password = useController({ control: form.control, name: 'password' });
  const confirmPassword = useController({ control: form.control, name: 'confirmPassword' });

  return { form, name, email, password, confirmPassword };
}

async function renderFilledForm() {
  const hook = await renderHook(() => useRegistrationHarness());

  await act(async () => {
    hook.result.current.name.field.onChange('Teste');
    hook.result.current.email.field.onChange('teste@example.com');
    hook.result.current.password.field.onChange('senha-teste-123');
    hook.result.current.confirmPassword.field.onChange('senha-teste-123');
  });

  return hook;
}

describe('useRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateUser.mockResolvedValue({
      id: 'user-1',
      name: 'Teste',
      email: 'teste@example.com',
      photoUrl: null,
    });
    mockCompleteSignUp.mockResolvedValue(undefined);
  });

  it('envia a escolha no formato esperado pela API', async () => {
    const { result } = await renderFilledForm();

    await act(async () => result.current.form.setSexChoice('feminino'));
    await act(async () => result.current.form.handleRegister());

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: 'Teste',
      email: 'teste@example.com',
      password: 'senha-teste-123',
      sex: 'FEMININO',
    });
    expect(mockCompleteSignUp).toHaveBeenCalledWith({
      email: 'teste@example.com',
      password: 'senha-teste-123',
    });
  });

  it('permite cadastrar sem selecionar sexo e omite o campo', async () => {
    const { result } = await renderFilledForm();

    await act(async () => result.current.form.handleRegister());

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: 'Teste',
      email: 'teste@example.com',
      password: 'senha-teste-123',
    });
  });

  it('apresenta o erro do cadastro e não inicia a sessão', async () => {
    mockCreateUser.mockRejectedValue(new ApiError('Cadastro inválido', 400, 'Cadastro inválido'));
    const { result } = await renderFilledForm();

    await act(async () => result.current.form.setSexChoice('masculino'));
    await act(async () => result.current.form.handleRegister());

    expect(result.current.form.error).toBe('Cadastro inválido');
    expect(result.current.form.sexChoice).toBe('masculino');
    expect(mockCompleteSignUp).not.toHaveBeenCalled();
  });
});

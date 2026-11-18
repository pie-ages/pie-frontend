import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useController } from 'react-hook-form';

import { useRecoveryCodeForm } from '@/hooks/UseRecoveryCodeForm';
import { requestPasswordRecovery, verifyRecoveryCode } from '@/services/auth';
import { ApiError } from '@/services/client';

jest.mock('@/services/auth');

const mockVerifyRecoveryCode = jest.mocked(verifyRecoveryCode);
const mockRequestPasswordRecovery = jest.mocked(requestPasswordRecovery);

const email = 'anna@pie.com.br';

function renderForm(onVerified = jest.fn()) {
  return renderHook(() => {
    const form = useRecoveryCodeForm(email, onVerified);
    const code = useController({ control: form.control, name: 'code' });
    return { form, code };
  });
}

describe('useRecoveryCodeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyRecoveryCode.mockResolvedValue('recovery-token');
    mockRequestPasswordRecovery.mockResolvedValue(undefined);
  });

  it('verifica o código e entrega o token da recuperação', async () => {
    const onVerified = jest.fn();
    const { result } = await renderForm(onVerified);

    await act(async () => result.current.code.field.onChange('123456'));
    await act(async () => result.current.form.handleVerify());

    expect(mockVerifyRecoveryCode).toHaveBeenCalledWith(email, '123456');
    expect(onVerified).toHaveBeenCalledWith('recovery-token');
  });

  it('não chama a API com um código incompleto', async () => {
    const { result } = await renderForm();

    await act(async () => result.current.code.field.onChange('123'));
    await act(async () => result.current.form.handleVerify());

    expect(mockVerifyRecoveryCode).not.toHaveBeenCalled();
    expect(result.current.form.codeError).toBe('Informe o código de 6 dígitos.');
  });

  it('mostra a mensagem do servidor quando o código é recusado', async () => {
    mockVerifyRecoveryCode.mockRejectedValue(
      new ApiError('Código inválido', 400, 'Código inválido ou expirado'),
    );
    const onVerified = jest.fn();
    const { result } = await renderForm(onVerified);

    await act(async () => result.current.code.field.onChange('123456'));
    await act(async () => result.current.form.handleVerify());

    expect(result.current.form.error).toBe('Código inválido ou expirado');
    expect(onVerified).not.toHaveBeenCalled();
  });

  it('reenvia o código para o mesmo e-mail e limpa o campo', async () => {
    const { result } = await renderForm();

    await act(async () => result.current.code.field.onChange('123456'));
    await act(async () => result.current.form.handleResend());

    expect(mockRequestPasswordRecovery).toHaveBeenCalledWith(email);
    expect(result.current.form.hasResent).toBe(true);
    expect(result.current.code.field.value).toBe('');
  });
});

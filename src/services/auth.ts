import { loginResponseSchema } from '@/schemas/authSchema';
import { apiPost, apiPostWithToken, apiPutWithToken, parseResponse } from '@/services/client';

export async function requestPasswordRecovery(email: string): Promise<void> {
  await apiPost<void>('/api/auth/recover', { email });
}

export async function verifyRecoveryCode(email: string, code: string): Promise<string> {
  const session = parseResponse(
    loginResponseSchema,
    await apiPost('/api/auth/recover/verify', { email, code }),
  );
  return session.accessToken;
}

export async function updatePassword(recoveryToken: string, password: string): Promise<void> {
  await apiPutWithToken<void>('/api/auth/password', recoveryToken, { password });
}

export async function revokeRecoverySession(recoveryToken: string): Promise<void> {
  await apiPostWithToken<void>('/api/auth/logout', recoveryToken);
}

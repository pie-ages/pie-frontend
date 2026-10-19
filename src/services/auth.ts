import { apiPost } from '@/services/client';

export async function requestPasswordRecovery(email: string): Promise<void> {
  await apiPost<void>('/api/auth/recover', { email });
}

export async function resetPassword(tokenHash: string, password: string): Promise<void> {
  await apiPost<void>('/api/auth/reset-password', { tokenHash, password });
}

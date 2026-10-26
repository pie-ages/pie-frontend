import type { RegisterFormData } from '@/schemas/authSchema';
import { currentUserSchema, type CurrentUser } from '@/schemas/userSchema';
import { apiGetAuth, apiPost, apiPutAuth, parseResponse } from '@/services/client';

export type RegisterUserPayload = Omit<RegisterFormData, 'confirmPassword'>;

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiGetAuth('/api/users/me', signal));
}

export async function registerUser(payload: RegisterUserPayload): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiPost('/api/users', payload));
}

export type UpdateUserPayload = {
  name: string;
  photoUrl: string | null;
};

export async function updateCurrentUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiPutAuth(`/api/users/${id}`, payload));
}

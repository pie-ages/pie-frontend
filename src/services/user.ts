import type { AccountSex } from '@/schemas/accountSexSchema';
import type { CreateUserPayload } from '@/schemas/authSchema';
import { currentUserSchema, type CurrentUser } from '@/schemas/userSchema';
import { apiGetAuth, apiPost, apiPutAuth, parseResponse } from '@/services/client';

export type RegisterUserPayload = CreateUserPayload;

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiGetAuth('/api/users/me', signal));
}

export async function registerUser(payload: RegisterUserPayload): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiPost('/api/users', payload));
}

export type UpdateUserPayload = {
  name: string;
  photoUrl: string | null;
  sex?: AccountSex;
};

export async function updateCurrentUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiPutAuth(`/api/users/${id}`, payload));
}

import { currentUserSchema, type CurrentUser } from '@/schemas/userSchema';
import { apiGetAuth, parseResponse } from '@/services/client';

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  return parseResponse(currentUserSchema, await apiGetAuth('/api/users/me', signal));
}

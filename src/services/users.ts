import {
  userResponseSchema,
  type CreateUserPayload,
  type UserResponse,
} from '@/schemas/authSchema';
import { apiPost, parseResponse } from '@/services/client';

export async function createUser(payload: CreateUserPayload): Promise<UserResponse> {
  return parseResponse(userResponseSchema, await apiPost('/api/users', payload));
}

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  access: 'pie_auth_token',
  refresh: 'pie_refresh_token',
  expiresAt: 'pie_expires_at',
  userId: 'pie_user_id',
};

async function get(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function set(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function remove(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export async function storeSession(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): Promise<void> {
  const expiresAt = String(Date.now() + expiresIn * 1000);
  await Promise.all([
    set(KEYS.access, accessToken),
    set(KEYS.refresh, refreshToken),
    set(KEYS.expiresAt, expiresAt),
  ]);
}

export async function getStoredToken(): Promise<string | null> {
  return get(KEYS.access);
}

export async function getStoredRefreshToken(): Promise<string | null> {
  return get(KEYS.refresh);
}

export async function getStoredExpiresAt(): Promise<number | null> {
  const raw = await get(KEYS.expiresAt);
  if (!raw) return null;
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

export async function storeUserId(userId: string | null): Promise<void> {
  if (userId === null) return remove(KEYS.userId);
  return set(KEYS.userId, userId);
}

export async function getStoredUserId(): Promise<string | null> {
  return get(KEYS.userId);
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    remove(KEYS.access),
    remove(KEYS.refresh),
    remove(KEYS.expiresAt),
    remove(KEYS.userId),
  ]);
}

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { OnboardingProgress } from '@/types/Onboarding';
import { getOnboardingStorageKey } from '@/utils/onboarding-progress';

export async function getStoredOnboardingProgress(userId: string): Promise<string | null> {
  const key = getOnboardingStorageKey(userId);

  if (Platform.OS === 'web') return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function storeOnboardingProgress(
  userId: string,
  progress: OnboardingProgress,
): Promise<void> {
  const key = getOnboardingStorageKey(userId);
  const value = JSON.stringify(progress);

  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

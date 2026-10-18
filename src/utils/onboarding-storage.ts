import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { OnboardingProgress } from '@/types/Onboarding';

const ONBOARDING_KEY = 'pie_onboarding_progress';

export async function getStoredOnboardingProgress(): Promise<string | null> {
  if (Platform.OS === 'web') return localStorage.getItem(ONBOARDING_KEY);
  return SecureStore.getItemAsync(ONBOARDING_KEY);
}

export async function storeOnboardingProgress(progress: OnboardingProgress): Promise<void> {
  const value = JSON.stringify(progress);

  if (Platform.OS === 'web') {
    localStorage.setItem(ONBOARDING_KEY, value);
    return;
  }
  return SecureStore.setItemAsync(ONBOARDING_KEY, value);
}
